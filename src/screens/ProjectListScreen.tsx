import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Project } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { NetworkStatus } from '../components/NetworkStatus';
import { useProjects } from '../hooks/useProjects';

type ProjectListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectList'>;

export const ProjectListScreen = () => {
  const navigation = useNavigation<ProjectListScreenNavigationProp>();
  const { projects, loading, syncing, isOnline, forceSync } = useProjects();

  // Navigate to edit mode with selected project preloaded
  const handleProjectPress = useCallback((project: Project) => {
    navigation.navigate('ProjectForm', { project });
  }, [navigation]);

  const handleAddProject = useCallback(() => {
    // Navigate to project form without a project (create mode)
    navigation.navigate('ProjectForm', { project: undefined });
  }, [navigation]);

  const handleRefresh = useCallback(() => {
    forceSync();
  }, [forceSync]);

  // Show full-screen loading indicator when initially loading data
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <NetworkStatus />
      
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        {/* Small indicator for sync in progress - less intrusive than full screen spinner */}
        {syncing && <ActivityIndicator size="small" color="#0000ff" style={styles.syncIndicator} />}
      </View>
      
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard 
            project={item} 
            onPress={handleProjectPress}
          />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No projects yet. Tap + to add one!</Text>
        }
      />
      
      {/* Optional manual sync FAB (allows forced refresh when auto sync might miss changes) */}
      <TouchableOpacity 
        style={styles.fabSync} 
        onPress={handleRefresh}
        // Disable during sync to prevent redundant API calls
        disabled={syncing}
      >
        <Text style={styles.fabText}>↻</Text>
      </TouchableOpacity>
      
      {/* Add project FAB - positioned below sync for easier one-handed access */}
      <TouchableOpacity 
        style={styles.fab} 
        onPress={handleAddProject}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  syncIndicator: {
    marginLeft: 10,
  },
  list: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#2196F3',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabSync: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 90,  // Positioned 70px above the add FAB
    backgroundColor: '#4CAF50',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 