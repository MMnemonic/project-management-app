import { useState, useEffect, useCallback, useRef } from 'react';
import { Project, SyncQueueItem } from '../types';
import { getProjects, saveProjects, addToSyncQueue, getSyncQueue, clearSyncQueue } from '../storage';
import { api } from '../api';
import { useNetworkStatus } from './useNetworkStatus';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { isConnected } = useNetworkStatus();
  const initialLoadDone = useRef(false);

  // First load from local storage - must happen before any sync
  useEffect(() => {
    const loadProjects = async () => {
      try {
        const localProjects = await getProjects();
        
        // Only update state if we have projects or first load (prevents flicker)
        if (localProjects.length > 0 || !initialLoadDone.current) {
          console.log('Setting projects from local storage:', localProjects.length);
          setProjects(localProjects);
        }
        
        setLoading(false);
        initialLoadDone.current = true;
      } catch (error) {
        console.error('Error in initial load:', error);
        setLoading(false);
      }
    };
    
    loadProjects();
  }, []);

  // Wait for both connectivity AND initial data load before syncing
  useEffect(() => {
    if (isConnected && !loading && initialLoadDone.current) {
      syncWithServer();
    }
  }, [isConnected, loading]);

  // In real apps, I'd use uuid() or server-generated IDs
  // But for this test, a timestamp-based ID keeps things fast and dependency-free
  const generateId = () => {
    return Date.now().toString();
  };

  // Create a new project
  const createProject = useCallback(async (project: Omit<Project, 'id' | 'updatedAt'>) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      updatedAt: Date.now()
    };

    try {
      // Always work with fresh data from storage
      const currentProjects = await getProjects();
      
      // Add the new project
      const updatedProjects = [...currentProjects, newProject];
      
      // Save to storage first - optimistic UI update
      await saveProjects(updatedProjects);
      
      // Then update the state
      setProjects(updatedProjects);

      // If online, sync immediately, otherwise queue for later
      if (isConnected) {
        try {
          await api.createProject(newProject);
        } catch (error) {
          console.error('Error creating project on server:', error);
          await addToSyncQueue({
            id: newProject.id,
            operation: 'create',
            data: newProject,
            timestamp: Date.now()
          });
        }
      } else {
        await addToSyncQueue({
          id: newProject.id,
          operation: 'create',
          data: newProject,
          timestamp: Date.now()
        });
      }

      return newProject;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }, [isConnected]);

  // Update an existing project
  const updateProject = useCallback(async (updatedProject: Project) => {
    // Update timestamp for conflict resolution
    const projectWithTimestamp = {
      ...updatedProject,
      updatedAt: Date.now()
    };

    try {
      // Get fresh projects list - don't trust state because of possible race conditions
      const currentProjects = await getProjects();
      
      // Replace the old project with updated one
      const updatedProjects = currentProjects.map(p => 
        p.id === projectWithTimestamp.id ? projectWithTimestamp : p
      );
      
      // Persist first, then update UI - safer approach
      await saveProjects(updatedProjects);
      setProjects(updatedProjects);

      // Online? Update server now. Offline? Queue it up for later
      if (isConnected) {
        try {
          await api.updateProject(projectWithTimestamp);
        } catch (error) {
          console.error('Error updating project on server:', error);
          await addToSyncQueue({
            id: projectWithTimestamp.id,
            operation: 'update',
            data: projectWithTimestamp,
            timestamp: Date.now()
          });
        }
      } else {
        await addToSyncQueue({
          id: projectWithTimestamp.id,
          operation: 'update',
          data: projectWithTimestamp,
          timestamp: Date.now()
        });
      }

      return projectWithTimestamp;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }, [isConnected]);

  // Sync local changes with the server
  const syncWithServer = async () => {
    if (!isConnected || syncing || loading) return;

    try {
      setSyncing(true);
      console.log('Starting sync with server');
      
      // Process any pending operations first
      const queue = await getSyncQueue();
      console.log('Sync queue length:', queue.length);
      
      if (queue.length > 0) {
        // Dedup by ID and keep only the latest version of each project
        const projectMap = new Map<string, Project>();
        
        queue.forEach((item: SyncQueueItem) => {
          const existing = projectMap.get(item.data.id);
          if (!existing || existing.updatedAt < item.data.updatedAt) {
            projectMap.set(item.data.id, item.data);
          }
        });

        const projectsToSync = Array.from(projectMap.values());
        
        // Send consolidated changes to server
        await api.syncProjects(projectsToSync);
        await clearSyncQueue();
      }
      
      // Get latest from server - but don't blindly overwrite with empty data
      const serverProjects = await api.getProjects();
      console.log('Fetched from server:', serverProjects.length, 'projects');
      
      if (serverProjects.length > 0) {
        setProjects(serverProjects);
        await saveProjects(serverProjects);
        console.log('Updated with server projects');
      } else {
        // Server data is empty but we have local data? Push ours up instead
        // Probably overkill for a 4-hour test, but wanted to handle this edge case cleanly
        const localProjects = await getProjects();
        if (localProjects.length > 0) {
          console.log('Server has no projects but local has', localProjects.length, '- pushing to server');
          await api.syncProjects(localProjects);
        }
      }
      
    } catch (error) {
      console.error('Error syncing with server:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Refresh from local storage
  const refreshLocalProjects = async () => {
    try {
      setSyncing(true);
      const localProjects = await getProjects();
      console.log('Refreshing from local storage:', localProjects.length, 'projects');
      
      if (localProjects.length > 0) {
        setProjects(localProjects);
      }
    } catch (error) {
      console.error('Error refreshing from local storage:', error);
    } finally {
      setSyncing(false);
    }
  };

  // Force a manual sync/refresh
  const forceSync = useCallback(async () => {
    // TODO: Could add a debounce here to prevent rapid tapping
    // And maybe a small spinner on the button itself rather than just the header
    if (isConnected) {
      return syncWithServer();
    } else {
      // When offline, just grab latest from storage
      return refreshLocalProjects();
    }
  }, [isConnected]);

  return {
    projects,
    loading,
    syncing,
    isOnline: isConnected,
    createProject,
    updateProject,
    forceSync
  };
}; 