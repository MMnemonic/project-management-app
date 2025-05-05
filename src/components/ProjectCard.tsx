import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Project } from '../types';

interface Props {
  project: Project;
  onPress: (project: Project) => void;
}

export const ProjectCard = ({ project, onPress }: Props) => {
  // Map status to colors
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Backlog': return '#9E9E9E';
      case 'To Do': return '#2196F3';
      case 'In Progress': return '#FF9800';
      case 'Completed': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(project)}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{project.name}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(project.status) }
        ]}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>
      
      {project.assignee && (
        <Text style={styles.assignee}>Assignee: {project.assignee}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  assignee: {
    fontSize: 14,
    color: '#666',
  },
}); 