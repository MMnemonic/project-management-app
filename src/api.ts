import { Project } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// The key used to store projects in AsyncStorage
const PROJECTS_KEY = 'projects_data';

// Simulate server delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory store to simulate a backend
let projectsStore: Project[] = [];

// Initialize the API store from AsyncStorage - this is crucial
// to simulate a "real" backend that persists data
const initializeStoreFromStorage = async () => {
  try {
    const projectsJson = await AsyncStorage.getItem(PROJECTS_KEY);
    if (projectsJson) {
      projectsStore = JSON.parse(projectsJson);
      console.log('API store initialized with:', projectsStore.length, 'projects');
    }
  } catch (error) {
    console.error('Error initializing API store:', error);
  }
};

// Initialize on import
initializeStoreFromStorage();

// Simulated API calls
export const api = {
  // Fetch all projects
  getProjects: async (): Promise<Project[]> => {
    // Make sure store is initialized
    if (projectsStore.length === 0) {
      await initializeStoreFromStorage();
    }
    
    // Simulate network delay
    await delay(800);
    return [...projectsStore];
  },

  // Create a new project
  createProject: async (project: Project): Promise<Project> => {
    await delay(500);
    projectsStore.push(project);
    return project;
  },

  // Update an existing project
  updateProject: async (project: Project): Promise<Project> => {
    await delay(500);
    const index = projectsStore.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projectsStore[index] = project;
      return project;
    }
    throw new Error('Project not found');
  },

  // Sync multiple operations at once
  syncProjects: async (projects: Project[]): Promise<void> => {
    await delay(1000);
    
    for (const project of projects) {
      const index = projectsStore.findIndex(p => p.id === project.id);
      if (index >= 0) {
        // Only update if server version is older (simplified conflict resolution)
        if (projectsStore[index].updatedAt < project.updatedAt) {
          projectsStore[index] = project;
        }
      } else {
        projectsStore.push(project);
      }
    }
  }
}; 