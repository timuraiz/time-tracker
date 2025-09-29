import { Colors } from "@/constants/theme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiService } from "../services/api";
import { TimeEntriesStorage } from "../storage/time-entries-storage";
import { useColorScheme } from "./use-color-scheme";
import { useProjects } from "./use-projects";
import { TimeEntry } from "./use-timer";

export function useTimeEntriesWithStorage() {
  const queryClient = useQueryClient();
  const colorsScheme = useColorScheme();
  const { projects } = useProjects();

  const {
    data: timeEntries = [],
    isLoading,
    refetch: refreshFromServer,
  } = useQuery({
    queryKey: ["timeEntries"],
    queryFn: async () => {
      try {
        // Try to fetch from server first
        const response = await apiService.getTimeEntries({ limit: "50" });
        const apiTimeEntries = response.data?.data || [];

        // Transform API data to UI format
        const transformedEntries: TimeEntry[] = apiTimeEntries.map((entry) => ({
          id: entry.id,
          project: entry?.project?.name || "General",
          color: entry?.project?.color || Colors[colorsScheme ?? "light"].primary,
          startTime: new Date(entry.start_time),
          endTime: entry.end_time ? new Date(entry.end_time) : undefined,
          duration: entry.duration ? entry.duration * 1000 : 0, // Convert seconds to milliseconds
        }));

        // Save to local storage for offline access
        await TimeEntriesStorage.saveTimeEntries(transformedEntries);

        return transformedEntries;
      } catch (error) {
        console.error("Failed to fetch time entries from server, using cached data:", error);
        // Fallback to cached data when server is unavailable
        return await TimeEntriesStorage.getTimeEntries();
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent than projects)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });

  const createTimeEntryMutation = useMutation({
    mutationFn: async (data: { project_id?: string; start_time: string }) => {
      const response = await apiService.createTimeEntry(data);
      return response.data;
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: ["timeEntries"] });

      const previousEntries = queryClient.getQueryData<TimeEntry[]>(["timeEntries"]);

      // Create optimistic entry
      const selectedProject = projects.find(p => p.id === data.project_id);
      const optimisticEntry: TimeEntry = {
        id: `temp_${Date.now()}`,
        project: selectedProject?.name || "General",
        color: selectedProject?.color || Colors[colorsScheme ?? "light"].primary,
        startTime: new Date(data.start_time),
        duration: 0,
      };

      queryClient.setQueryData<TimeEntry[]>(["timeEntries"], (old = []) => {
        const updatedEntries = [optimisticEntry, ...old];
        TimeEntriesStorage.saveTimeEntries(updatedEntries);
        return updatedEntries;
      });

      return { previousEntries, optimisticEntry };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["timeEntries"], context?.previousEntries);
    },
    onSuccess: async (newEntry, _, context) => {
      if (newEntry && context?.optimisticEntry) {
        queryClient.setQueryData<TimeEntry[]>(["timeEntries"], (old = []) => {
          const updatedEntries = old.map((entry) =>
            entry.id === context.optimisticEntry.id
              ? { ...context.optimisticEntry, id: newEntry.id }
              : entry
          );
          TimeEntriesStorage.saveTimeEntries(updatedEntries);
          return updatedEntries;
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
    },
  });

  const updateTimeEntryMutation = useMutation({
    mutationFn: async ({ id, end_time }: { id: string; end_time: string }) => {
      return await apiService.updateTimeEntry({ id, end_time });
    },
    onMutate: async ({ id, end_time }) => {
      await queryClient.cancelQueries({ queryKey: ["timeEntries"] });

      const previousEntries = queryClient.getQueryData<TimeEntry[]>(["timeEntries"]);

      queryClient.setQueryData<TimeEntry[]>(["timeEntries"], (old = []) => {
        const endTimeDate = new Date(end_time);
        const updatedEntries = old.map((entry) => {
          if (entry.id === id) {
            return {
              ...entry,
              endTime: endTimeDate,
              duration: endTimeDate.getTime() - entry.startTime.getTime(),
            };
          }
          return entry;
        });
        TimeEntriesStorage.saveTimeEntries(updatedEntries);
        return updatedEntries;
      });

      return { previousEntries };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["timeEntries"], context?.previousEntries);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["timeEntries"] });
    },
  });

  // Update time entries when projects change (name or color updates)
  const syncWithProjects = () => {
    queryClient.setQueryData<TimeEntry[]>(["timeEntries"], (prevEntries = []) => {
      const updatedEntries = prevEntries.map(entry => {
        // Try to find project by checking if entry project name matches any project
        const matchingProject = projects.find(p => p.name === entry.project);
        if (matchingProject) {
          return {
            ...entry,
            project: matchingProject.name,
            color: matchingProject.color,
          };
        }
        // If no matching project found (project was deleted), set to General
        return {
          ...entry,
          project: "General",
          color: Colors[colorsScheme ?? "light"].primary,
        };
      });
      TimeEntriesStorage.saveTimeEntries(updatedEntries);
      return updatedEntries;
    });
  };

  return {
    timeEntries,
    isLoading,
    isSyncing: createTimeEntryMutation.isPending || updateTimeEntryMutation.isPending,
    isOnline: true, // You can add network detection here if needed
    createTimeEntry: createTimeEntryMutation.mutateAsync,
    updateTimeEntry: ({ id, end_time }: { id: string; end_time: string }) =>
      updateTimeEntryMutation.mutateAsync({ id, end_time }),
    refreshFromServer,
    syncWithProjects,
  };
}