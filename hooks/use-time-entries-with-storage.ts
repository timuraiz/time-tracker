import { Colors } from "@/constants/theme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import { apiService } from "../services/api";
import { TimeEntriesStorage } from "../storage/time-entries-storage";
import { useColorScheme } from "./use-color-scheme";
import { useProjects } from "./use-projects";
import { TimeEntry } from "./use-timer";

export function useTimeEntriesWithStorage() {
  const queryClient = useQueryClient();
  const colorsScheme = useColorScheme();
  const { projects } = useProjects();
  const [isOnline, setIsOnline] = useState(true);

  // Network state listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? false);
    });

    return () => unsubscribe();
  }, []);

  const {
    data: timeEntries = [],
    isLoading,
    refetch: refreshFromServer,
  } = useQuery({
    queryKey: ["timeEntries"],
    queryFn: async () => {
      // Always load cached data first
      const cachedEntries = await TimeEntriesStorage.getTimeEntries();

      try {
        // Try to fetch from server
        const response = await apiService.getTimeEntries({ limit: "50" });

        if (response.error || !response.data) {
          // If server error, return cached data
          console.log("Server error, using cached data:", response.error);
          return cachedEntries;
        }

        const apiTimeEntries = response.data.data || [];

        // Transform API data to UI format, preserving cached project info if server doesn't return it
        const transformedEntries: TimeEntry[] = apiTimeEntries.map((entry) => {
          const cachedEntry = cachedEntries.find(e => e.id === entry.id);

          return {
            id: entry.id,
            project: entry?.project?.name || cachedEntry?.project || "General",
            color: entry?.project?.color || cachedEntry?.color || Colors[colorsScheme ?? "light"].primary,
            startTime: new Date(entry.start_time),
            endTime: entry.end_time ? new Date(entry.end_time) : undefined,
            duration: entry.duration ? entry.duration * 1000 : 0, // Convert seconds to milliseconds
          };
        });

        // Save to local storage for offline access
        await TimeEntriesStorage.saveTimeEntries(transformedEntries);

        return transformedEntries;
      } catch (error) {
        console.error("Failed to fetch time entries from server, using cached data:", error);
        // Fallback to cached data when server is unavailable
        return cachedEntries;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent than projects)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: false, // Don't retry on error, use cached data instead
  });

  const createTimeEntryMutation = useMutation({
    mutationFn: async (data: { project_id?: string; start_time: string }) => {
      console.log("DATA", data.project_id);
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
    isOnline,
    createTimeEntry: createTimeEntryMutation.mutateAsync,
    updateTimeEntry: ({ id, end_time }: { id: string; end_time: string }) =>
      updateTimeEntryMutation.mutateAsync({ id, end_time }),
    refreshFromServer,
    syncWithProjects,
  };
}