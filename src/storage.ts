import AsyncStorage from '@react-native-async-storage/async-storage';
import { Project, SyncQueueItem } from './types';

const PROJECTS_KEY = 'projects_data';
const SYNC_QUEUE_KEY = 'sync_queue_data';

// Get all projects from storage
export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
    console.log('Retrieved from storage:', projectsJson);
    return projectsJson ? JSON.parse(projectsJson) : [];
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
};

// Save all projects to storage
export const saveProjects = async (projects: Project[]): Promise<void> => {
  try {
    const projectsJson = JSON.stringify(projects);
    console.log('Saving to storage:', projectsJson);
    await AsyncStorage.setItem(PROJECTS_KEY, projectsJson);
    
    // Verify save was successful
    const savedJson = await AsyncStorage.getItem(PROJECTS_KEY);
    console.log('Verification - saved data:', savedJson);
    
    if (!savedJson) {
      console.error('Verification failed: No data was saved');
    }
  } catch (error) {
    console.error('Error saving projects:', error);
  }
};

// Add item to sync queue
export const addToSyncQueue = async (item: SyncQueueItem): Promise<void> => {
  try {
    const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    const queue: SyncQueueItem[] = queueJson ? JSON.parse(queueJson) : [];
    queue.push(item);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Error adding to sync queue:', error);
  }
};

// Get sync queue
export const getSyncQueue = async (): Promise<SyncQueueItem[]> => {
  try {
    const queueJson = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return queueJson ? JSON.parse(queueJson) : [];
  } catch (error) {
    console.error('Error getting sync queue:', error);
    return [];
  }
};

// Clear sync queue
export const clearSyncQueue = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing sync queue:', error);
  }
}; 