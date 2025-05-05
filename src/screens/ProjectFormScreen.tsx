import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ProjectStatus } from '../types';
import { NetworkStatus } from '../components/NetworkStatus';
import { useProjects } from '../hooks/useProjects';

type ProjectFormRouteProp = RouteProp<RootStackParamList, 'ProjectForm'>;
type ProjectFormNavigationProp = StackNavigationProp<RootStackParamList, 'ProjectForm'>;

const STATUS_OPTIONS: ProjectStatus[] = ['Backlog', 'To Do', 'In Progress', 'Completed'];

export const ProjectFormScreen = () => {
  const route = useRoute<ProjectFormRouteProp>();
  const navigation = useNavigation<ProjectFormNavigationProp>();
  const { createProject, updateProject } = useProjects();
  
  const existingProject = route.params?.project;
  // Used to toggle between "Create" and "Edit" mode — avoids duplicating form logic
  const isEditing = !!existingProject;
  
  const [name, setName] = useState(existingProject?.name || '');
  const [status, setStatus] = useState<ProjectStatus>(existingProject?.status || 'Backlog');
  const [assignee, setAssignee] = useState(existingProject?.assignee || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Project' : 'New Project'
    });
  }, [navigation, isEditing]);
  
  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Project name is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing && existingProject) {
        await updateProject({
          ...existingProject,
          name: name.trim(),
          status,
          assignee: assignee.trim() || undefined
        });
      } else {
        await createProject({
          name: name.trim(),
          status,
          assignee: assignee.trim() || undefined
        });
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save project');
      console.error(error);
    } finally {
      // Ensure button re-enables even if API call fails or throws
      setIsSubmitting(false);
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <NetworkStatus />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Project Name*</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter project name"
            autoCapitalize="none"
            // Disabling inputs during submission prevents accidental edits while saving
            editable={!isSubmitting}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Status</Text>
          {/* Left inline for now — simple enough that a separate component felt unnecessary */}
          <View style={styles.statusContainer}>
            {STATUS_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.statusOption,
                  status === option && styles.statusSelected
                ]}
                onPress={() => setStatus(option)}
                disabled={isSubmitting}
              >
                <Text style={[
                  styles.statusText,
                  status === option && styles.statusTextSelected
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Assignee (Optional)</Text>
          <TextInput
            style={styles.input}
            value={assignee}
            onChangeText={setAssignee}
            placeholder="Enter assignee name"
            autoCapitalize="words"
            // Disabling inputs during submission prevents accidental edits while saving
            editable={!isSubmitting}
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            // Preventing navigation during submission
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            // Disabling when submitting or when name is empty prevents invalid submissions
            disabled={isSubmitting || !name.trim()}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statusOption: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusSelected: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  statusText: {
    fontSize: 14,
  },
  statusTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9E9E9E',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 