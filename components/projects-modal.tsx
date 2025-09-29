import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProjects } from "@/hooks/useProjects";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ProjectsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectProject: (project: any) => void;
}

const PROJECT_COLORS = [
  "#007bff",
  "#28a745",
  "#ffc107",
  "#dc3545",
  "#6f42c1",
  "#fd7e14",
  "#20c997",
  "#6c757d",
];

export default function ProjectsModal({
  visible,
  onClose,
  onSelectProject,
}: ProjectsModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const { projects, isLoading, createProject, deleteProject } = useProjects();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      Alert.alert("Error", "Please enter a project name");
      return;
    }

    try {
      createProject({
        name: newProjectName.trim(),
        description: newProjectDescription.trim(),
        color: selectedColor,
      });

      setNewProjectName("");
      setNewProjectDescription("");
      setSelectedColor(PROJECT_COLORS[0]);
      setShowCreateForm(false);

      Alert.alert("Success", "Project created successfully!");
    } catch {
      Alert.alert("Error", "Failed to create project");
    }
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length === 1) {
      Alert.alert("Error", "You must have at least one project");
      return;
    }

    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProject(projectId);
              Alert.alert("Success", "Project deleted successfully!");
            } catch {
              Alert.alert("Error", "Failed to delete project");
            }
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      width: "90%",
      maxHeight: "85%",
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      padding: 0,
      flex: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 10,
      },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 20,
      borderStartStartRadius: 20,
      borderStartEndRadius: 20,
      backgroundColor: colors.cardBackground,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
    },
    closeButton: {
      padding: 8,
      borderRadius: 20,
    },
    closeButtonText: {
      fontSize: 16,
      color: colors.icon,
      fontWeight: "600",
    },
    createButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      marginHorizontal: 24,
      marginTop: 20,
      marginBottom: 16,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 6,
    },
    createButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    projectsList: {
      maxHeight: 320,
      paddingHorizontal: 24,
      paddingBottom: 10,
    },
    projectCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 18,
      borderRadius: 16,
      backgroundColor: colors.background,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
    },
    colorIndicator: {
      width: 4,
      height: 44,
      borderRadius: 2,
      marginRight: 16,
    },
    projectInfo: {
      flex: 1,
    },
    projectName: {
      fontSize: 17,
      fontWeight: "600",
      marginBottom: 2,
      color: colors.text,
    },
    projectDescription: {
      fontSize: 14,
      color: colors.icon,
      lineHeight: 18,
    },
    deleteButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: "#fff0f0",
    },
    createForm: {
      marginBottom: 16,
      padding: 16,
      backgroundColor: colors.background,
      borderRadius: 12,
    },
    formTitle: {
      fontSize: 18,
      fontWeight: "600",
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
      fontWeight: "600",
      marginBottom: 8,
    },
    colorOptions: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    colorOption: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: "transparent",
    },
    colorOptionSelected: {
      borderColor: colors.text,
    },
    formButtons: {
      flexDirection: "row",
      gap: 12,
    },
    formButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    saveButton: {
      backgroundColor: colors.primary,
    },
    cancelButton: {
      backgroundColor: colors.danger,
    },
    formButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    saveButtonText: {
      color: "#fff",
    },
    cancelButtonText: {
      color: "#fff",
    },
  });

  console.log("Projects:", projects);
  console.log("Projects length:", projects.length);
  console.log("Is loading:", isLoading);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>Manage Projects</ThemedText>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <ThemedText style={styles.closeButtonText}>✕</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {!showCreateForm && (
            <ScrollView style={styles.projectsList}>
              {isLoading ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <ThemedText style={{ marginTop: 10, opacity: 0.7 }}>
                    Loading projects...
                  </ThemedText>
                </View>
              ) : projects.length === 0 ? (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <ThemedText style={{ opacity: 0.7 }}>
                    No projects yet. Create your first project!
                  </ThemedText>
                </View>
              ) : (
                projects.map((project) => (
                  <TouchableOpacity
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => onSelectProject(project)}
                  >
                    <View
                      style={[
                        styles.colorIndicator,
                        { backgroundColor: project.color },
                      ]}
                    />
                    <View style={styles.projectInfo}>
                      <ThemedText style={styles.projectName}>
                        {project.name}
                      </ThemedText>
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
                      <MaterialIcons name="delete" size={20} color="#e74c3c" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}

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
                  <ThemedText
                    style={[styles.formButtonText, styles.cancelButtonText]}
                  >
                    Cancel
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.saveButton]}
                  onPress={handleCreateProject}
                >
                  <ThemedText
                    style={[styles.formButtonText, styles.saveButtonText]}
                  >
                    Create
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          )}
        </ThemedView>
      </View>
    </Modal>
  );
}
