import { useEffect, useState } from "react";
import { useColorScheme } from "./use-color-scheme";
import { useProjects } from "./use-projects";
import { useTimeEntriesWithStorage } from "./use-time-entries-with-storage";

export interface TimeEntry {
  id?: string;
  project: string;
  color: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
}

export function useTimer(selectedProject?: {
  name: string;
  id: string;
  color: string;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  const colorsScheme = useColorScheme();

  const {
    timeEntries,
    isLoading: isLoadingEntries,
    isOnline,
    isSyncing,
    createTimeEntry,
    updateTimeEntry,
    syncWithProjects,
  } = useTimeEntriesWithStorage();

  const projects = useProjects();

  // Sync time entries with project changes
  useEffect(() => {
    syncWithProjects();
  }, [projects]);

  // Timer interval effect
  useEffect(() => {
    let interval: number;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Check for unfinished sessions and resume timer
  useEffect(() => {
    if (!isLoadingEntries && timeEntries.length > 0 && !isRunning) {
      // Find the most recent unfinished session (no end_time)
      const unfinishedSession = timeEntries.find((entry) => !entry.endTime);

      if (unfinishedSession) {
        // Resume the timer for this session
        setIsRunning(true);
        setStartTime(unfinishedSession.startTime);
        setCurrentEntryId(unfinishedSession.id || null);
        // Set initial elapsed time from the actual start time
        setElapsedTime(Date.now() - unfinishedSession.startTime.getTime());
      }
    }
  }, [isLoadingEntries, timeEntries.length]);

  const handleStartStop = async () => {
    if (isRunning) {
      // Stop timer
      const endTime = new Date();
      setIsRunning(false);
      setStartTime(null);
      setElapsedTime(0);
      const entryId = currentEntryId;
      setCurrentEntryId(null);

      // Make API request (React Query will handle optimistic updates)
      if (entryId) {
        try {
          await updateTimeEntry({
            id: entryId,
            end_time: endTime.toISOString(),
          });
        } catch (error) {
          console.error("Error updating time entry:", error);
          // Revert local timer state on error
          setIsRunning(true);
          setStartTime(new Date(Date.now() - elapsedTime));
          setCurrentEntryId(entryId);
        }
      }
    } else {
      // Start timer
      const startTime = new Date();
      setIsRunning(true);
      setStartTime(startTime);

      // Make API request (React Query will handle optimistic updates)
      try {
        const newEntry = await createTimeEntry({
          project_id: selectedProject?.id,
          start_time: startTime.toISOString(),
        });

        if (newEntry?.id) {
          setCurrentEntryId(newEntry.id);
        }
      } catch (error) {
        console.error("Error creating time entry:", error);
        // Revert local timer state on error
        setIsRunning(false);
        setStartTime(null);
      }
    }
  };

  const getTotalDuration = () => {
    const today = new Date().toDateString();
    return timeEntries
      .filter((entry) => entry.startTime.toDateString() === today)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const getTodaySessionsCount = () => {
    const today = new Date().toDateString();
    return timeEntries.filter(
      (entry) => entry.startTime.toDateString() === today
    ).length;
  };

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    return `${hours.toString().padStart(2, "0")}:${(mins % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  return {
    // State
    isRunning,
    elapsedTime,
    currentEntryId,
    timeEntries,
    isLoadingEntries,
    isOnline,
    isSyncing,

    // Actions
    handleStartStop,

    // Computed values
    getTotalDuration,
    getTodaySessionsCount,
    formatTime,
  };
}
