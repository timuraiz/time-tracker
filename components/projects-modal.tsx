import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useProjects } from '@/hooks/useProjects';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ProjectsModalProps {
  visible: boolean;
  onClose: () => void;
}

const PROJECT_COLORS = [
  '#007bff', '#28a745', '#ffc107', '#dc3545',
  '#6f42c1', '#fd7e14', '#20c997', '#6c757d'
];

export default function ProjectsModal({ visible, onClose }: ProjectsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    projects,
    isLoading,
    createProject,
    deleteProject,
  } = useProjects();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    try {
      await createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        color: selectedColor,
      });

      setNewProjectName('');
      setNewProjectDescription('');
      setSelectedColor(PROJECT_COLORS[0]);
      setShowCreateForm(false);

      Alert.alert('Success', 'Project created successfully!');
    } catch {
      Alert.alert('Error', 'Failed to create project');
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length === 1) {
      Alert.alert('Error', 'You must have at least one project');
      return;
    }

    Alert.alert(
      'Delete Project',
      'Are you sure you want to delete this project?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteProject(projectId);
              Alert.alert('Success', 'Project deleted successfully!');
            } catch {
              Alert.alert('Error', 'Failed to delete project');
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxHeight: '80%',
      backgroundColor: colors.cardBackground,
      borderRadius: 24,
      padding: 24,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    closeButton: {
      padding: 8,
    },
    closeButtonText: {
      fontSize: 18,
      color: colors.primary,
    },
    createButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 12,
      borderRadius: 12,
      marginBottom: 16,
      alignItems: 'center',
    },
    createButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    projectsList: {
      flex: 1,
    },
    projectCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 12,
      backgroundColor: colors.background,
      marginBottom: 12,
      borderLeftWidth: 4,
    },
    colorIndicator: {
      width: 12,
      height: 40,
      borderRadius: 6,
      marginRight: 16,
    },
    projectInfo: {
      flex: 1,
    },
    projectName: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    projectDescription: {
      fontSize: 14,
      opacity: 0.7,
    },
    deleteButton: {
      padding: 8,
    },
    deleteButtonText: {
      fontSize: 16,
      color: '#ff4444',
    },
    createForm: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: colors.background,
      borderRadius: 12,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: colors.cardBackground,
      color: colors.text,
      marginBottom: 12,
    },
    colorSelector: {
      marginBottom: 16,
    },
    colorLabel: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 8,
    },
    colorOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: 'transparent',
    },
    colorOptionSelected: {
      borderColor: colors.text,
    },
    formButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    formButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.danger,
    },
    formButtonText: {
      fontSize: 16,
      fontWeight: '600',
    },
    saveButtonText: {
      color: '#fff',
    },
    cancelButtonText: {
      color: '#fff',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Manage Projects</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </View>

          {!showCreateForm && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateForm(true)}
            >
              <ThemedText style={styles.createButtonText}>
                + Create New Project
              </ThemedText>
            </TouchableOpacity>
          )}

          {showCreateForm && (
            <ThemedView style={styles.createForm}>
              <ThemedText style={styles.formTitle}>New Project</ThemedText>

              <TextInput
                style={styles.input}
                placeholder="Project name"
                placeholderTextColor={colors.icon}
                value={newProjectName}
                onChangeText={setNewProjectName}
              />

              <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                placeholderTextColor={colors.icon}
                value={newProjectDescription}
                onChangeText={setNewProjectDescription}
                multiline
              />

              <View style={styles.colorSelector}>
                <ThemedText style={styles.colorLabel}>Choose Color</ThemedText>
                <View style={styles.colorOptions}>
                  {PROJECT_COLORS.map((color) => (
                    <TouchableOpacity
                      key={color}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        selectedColor === color && styles.colorOptionSelected,
                      ]}
                      onPress={() => setSelectedColor(color)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => setShowCreateForm(false)}
                >
                  <ThemedText style={[styles.formButtonText, styles.cancelButtonText]}>
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleCreateProject}
                >
                  <ThemedText style={[styles.formButtonText, styles.saveButtonText]}>
                    Create
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          )}

          <ScrollView style={styles.projectsList}>
            {isLoading ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <ThemedText style={{ marginTop: 10, opacity: 0.7 }}>
                  Loading projects...
                </ThemedText>
              </View>
            ) : projects.length === 0 ? (
              <View style={{ padding: 20, alignItems: 'center' }}>
                <ThemedText style={{ opacity: 0.7 }}>
                  No projects yet. Create your first project!
                </ThemedText>
              </View>
            ) : (
              projects.map((project) => (
              <View key={project.id} style={styles.projectCard}>
                <View
                  style={[styles.colorIndicator, { backgroundColor: project.color }]}
                />
                <View style={styles.projectInfo}>
                  <ThemedText style={styles.projectName}>{project.name}</ThemedText>
                  {project.description ? (
                    <ThemedText style={styles.projectDescription}>
                      {project.description}
                    </ThemedText>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProject(project.id)}
                >
                  <ThemedText style={styles.deleteButtonText}>🗑️</ThemedText>
                </TouchableOpacity>
              </View>
              ))
            )}
          </ScrollView>
        </ThemedView>
      </View>
    </Modal>
  );
}