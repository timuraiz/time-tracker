import { useState, useEffect } from 'react';
import { apiService, Project, CreateProjectRequest } from '../services/api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load projects from API on mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getProjects({ limit: "50" });
      if (response.data?.data) {
        setProjects(response.data.data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createProject = async (data: CreateProjectRequest) => {
    try {
      setIsSyncing(true);

      // Create optimistic entry for immediate UI update
      const optimisticProject: Project = {
        id: `temp_${Date.now()}`,
        name: data.name,
        description: data.description || '',
        color: data.color,
        created_at: new Date().toISOString(),
      };

      // Update UI immediately
      setProjects(prev => [optimisticProject, ...prev]);

      // Make API call
      const response = await apiService.createProject(data);

      if (response.data) {
        // Replace optimistic entry with real data
        setProjects(prev =>
          prev.map(project =>
            project.id === optimisticProject.id ? response.data! : project
          )
        );
        return response.data;
      }

      return optimisticProject;
    } catch (error) {
      console.error('Error creating project:', error);
      // Remove optimistic entry on error
      setProjects(prev => prev.filter(project => project.id !== `temp_${Date.now()}`));
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateProject = async (id: string, data: Partial<CreateProjectRequest>) => {
    try {
      setIsSyncing(true);

      // Update UI immediately
      setProjects(prev => prev.map(project => {
        if (project.id === id) {
          return {
            ...project,
            ...data
          };
        }
        return project;
      }));

      // Make API call
      await apiService.updateProject({
        id,
        ...data,
      });

    } catch (error) {
      console.error('Error updating project:', error);
      // Refresh from server on error
      loadProjects();
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setIsSyncing(true);

      // Update UI immediately
      setProjects(prev => prev.filter(project => project.id !== id));

      // Make API call
      await apiService.deleteProject(id);

    } catch (error) {
      console.error('Error deleting project:', error);
      // Refresh from server on error
      loadProjects();
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    projects,
    isLoading,
    isSyncing,
    createProject,
    updateProject,
    deleteProject,
    refreshFromServer: loadProjects,
  };
}