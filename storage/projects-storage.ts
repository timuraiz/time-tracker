import AsyncStorage from "@react-native-async-storage/async-storage";
import { Project } from "../services/api";

const PROJECTS_STORAGE_KEY = "projects";

export class ProjectsStorage {
  static async saveProjects(projects: Project[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch (error) {
      console.error("Failed to save projects to storage:", error);
    }
  }

  static async getProjects(): Promise<Project[]> {
    try {
      const stored = await AsyncStorage.getItem(PROJECTS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load projects from storage:", error);
      return [];
    }
  }

  static async clearProjects(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PROJECTS_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear projects from storage:", error);
    }
  }

  static async updateProject(updatedProject: Project): Promise<void> {
    try {
      const projects = await this.getProjects();
      const updatedProjects = projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      await this.saveProjects(updatedProjects);
    } catch (error) {
      console.error("Failed to update project in storage:", error);
    }
  }

  static async addProject(newProject: Project): Promise<void> {
    try {
      const projects = await this.getProjects();
      await this.saveProjects([newProject, ...projects]);
    } catch (error) {
      console.error("Failed to add project to storage:", error);
    }
  }

  static async removeProject(projectId: string): Promise<void> {
    try {
      const projects = await this.getProjects();
      const filteredProjects = projects.filter((project) => project.id !== projectId);
      await this.saveProjects(filteredProjects);
    } catch (error) {
      console.error("Failed to remove project from storage:", error);
    }
  }
}