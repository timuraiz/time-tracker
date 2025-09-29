import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiService, CreateProjectRequest, Project } from "../services/api";
import { ProjectsStorage } from "../storage/projects-storage";

export function useProjects() {
  const queryClient = useQueryClient();

  const {
    data: projects = [],
    isLoading,
    refetch: refreshFromServer,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        // Try to fetch from server first
        const response = await apiService.getProjects({ limit: "50" });
        const serverProjects = response.data?.data || [];

        // Save to local storage for offline access
        await ProjectsStorage.saveProjects(serverProjects);

        return serverProjects;
      } catch (error) {
        console.error("Failed to fetch projects from server, using cached data:", error);
        // Fallback to cached data when server is unavailable
        return await ProjectsStorage.getProjects();
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: CreateProjectRequest) => {
      const response = await apiService.createProject(data);
      return response.data;
    },
    onMutate: async (data: CreateProjectRequest) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      // Snapshot the previous value
      const previousProjects = queryClient.getQueryData<Project[]>(["projects"]);

      // Optimistically update to the new value
      const optimisticProject: Project = {
        id: `temp_${Date.now()}`,
        name: data.name,
        description: data.description || "",
        color: data.color,
        created_at: new Date().toISOString(),
      };

      queryClient.setQueryData<Project[]>(["projects"], (old = []) => [
        optimisticProject,
        ...old,
      ]);

      // Return a context object with the snapshotted value
      return { previousProjects, optimisticProject };
    },
    onError: (_, __, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSuccess: async (newProject, _, context) => {
      // Replace optimistic project with real data
      if (newProject && context?.optimisticProject) {
        queryClient.setQueryData<Project[]>(["projects"], (old = []) => {
          const updatedProjects = old.map((project) =>
            project.id === context.optimisticProject.id ? newProject : project
          );
          // Sync to storage
          ProjectsStorage.saveProjects(updatedProjects);
          return updatedProjects;
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateProjectRequest>;
    }) => {
      return await apiService.updateProject({ id, ...data });
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData<Project[]>(["projects"]);

      queryClient.setQueryData<Project[]>(["projects"], (old = []) => {
        const updatedProjects = old.map((project) => {
          if (project.id === id) {
            return { ...project, ...data };
          }
          return project;
        });
        // Sync to storage
        ProjectsStorage.saveProjects(updatedProjects);
        return updatedProjects;
      });

      return { previousProjects };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiService.deleteProject(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });

      const previousProjects = queryClient.getQueryData<Project[]>(["projects"]);

      queryClient.setQueryData<Project[]>(["projects"], (old = []) => {
        const filteredProjects = old.filter((project) => project.id !== id);
        // Sync to storage
        ProjectsStorage.saveProjects(filteredProjects);
        return filteredProjects;
      });

      return { previousProjects };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["projects"], context?.previousProjects);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects,
    isLoading,
    isSyncing:
      createProjectMutation.isPending ||
      updateProjectMutation.isPending ||
      deleteProjectMutation.isPending,
    createProject: createProjectMutation.mutateAsync,
    updateProject: (id: string, data: Partial<CreateProjectRequest>) =>
      updateProjectMutation.mutateAsync({ id, data }),
    deleteProject: deleteProjectMutation.mutateAsync,
    refreshFromServer,
  };
}
