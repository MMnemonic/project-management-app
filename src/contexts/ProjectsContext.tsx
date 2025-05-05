import React, { createContext, useContext, ReactNode } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';

// Define the context type
interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  syncing: boolean;
  isOnline: boolean | null;
  createProject: (project: Omit<Project, 'id' | 'updatedAt'>) => Promise<Project>;
  updateProject: (project: Project) => Promise<Project>;
  forceSync: () => Promise<void>;
}

// Create the context
const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

// Provider component
export const ProjectsProvider = ({ children }: { children: ReactNode }) => {
  const projectsData = useProjects();
  
  return (
    <ProjectsContext.Provider value={projectsData}>
      {children}
    </ProjectsContext.Provider>
  );
};

// Custom hook to use the context
export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
}; 