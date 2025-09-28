import { useState, useEffect } from 'react';
import { apiService, CreateTimeEntryResponse } from '../services/api';

export function useTimeEntriesOffline() {
  const [timeEntries, setTimeEntries] = useState<CreateTimeEntryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load entries from API on mount
  useEffect(() => {
    loadTimeEntries();
  }, []);

  const loadTimeEntries = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getTimeEntries({ limit: "50" });
      if (response.data?.data) {
        setTimeEntries(response.data.data);
      }
    } catch (error) {
      console.error('Error loading time entries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTimeEntry = async (data: { project_name: string; start_time: string }) => {
    try {
      setIsSyncing(true);

      // Create optimistic entry for immediate UI update
      const optimisticEntry: CreateTimeEntryResponse = {
        id: `temp_${Date.now()}`,
        project_name: data.project_name,
        description: '',
        start_time: data.start_time,
        end_time: undefined,
        duration: 0,
        created_at: new Date().toISOString(),
      };

      // Update UI immediately
      setTimeEntries(prev => [optimisticEntry, ...prev]);

      // Make API call
      const response = await apiService.createTimeEntry(data);

      if (response.data) {
        // Replace optimistic entry with real data
        setTimeEntries(prev =>
          prev.map(entry =>
            entry.id === optimisticEntry.id ? response.data! : entry
          )
        );
        return response.data;
      }

      return optimisticEntry;
    } catch (error) {
      console.error('Error creating time entry:', error);
      // Remove optimistic entry on error
      setTimeEntries(prev => prev.filter(entry => entry.id !== `temp_${Date.now()}`));
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  const updateTimeEntry = async (id: string, data: { end_time: string; project_name: string; duration?: number }) => {
    try {
      setIsSyncing(true);

      // Update UI immediately with calculated duration
      setTimeEntries(prev => prev.map(entry => {
        if (entry.id === id) {
          const startTime = new Date(entry.start_time).getTime();
          const endTime = new Date(data.end_time).getTime();
          const calculatedDuration = data.duration || Math.floor((endTime - startTime) / 1000);

          return {
            ...entry,
            end_time: data.end_time,
            duration: calculatedDuration
          };
        }
        return entry;
      }));

      // Make API call
      await apiService.updateTimeEntry({
        id,
        project_name: data.project_name,
        end_time: data.end_time,
      });

    } catch (error) {
      console.error('Error updating time entry:', error);
      // Refresh from server on error
      loadTimeEntries();
      throw error;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    timeEntries,
    isLoading,
    isOnline,
    isSyncing,
    createTimeEntry,
    updateTimeEntry,
    refreshFromServer: loadTimeEntries,
  };
}