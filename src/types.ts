export type ProjectStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Completed';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  assignee?: string;
  updatedAt: number; // timestamp for sync conflicts
}

export interface SyncQueueItem {
  id: string;
  operation: 'create' | 'update';
  data: Project;
  timestamp: number;
}

// Navigation types
export type RootStackParamList = {
  ProjectList: undefined;
  ProjectForm: { project?: Project };
}; 