import { useEffect, useState } from 'react';
import { useTimeEntriesOffline } from './useTimeEntriesOffline';

export interface TimeEntry {
  id?: string;
  project: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
}

export function useTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  const {
    timeEntries: apiTimeEntries,
    isLoading: isLoadingEntries,
    isOnline,
    createTimeEntry,
    updateTimeEntry,
  } = useTimeEntriesOffline();

  // Transform API data to match our UI TimeEntry interface
  const timeEntries: TimeEntry[] = apiTimeEntries.map((entry) => ({
    id: entry.id,
    project: entry.project_name,
    startTime: new Date(entry.start_time),
    endTime: entry.end_time ? new Date(entry.end_time) : undefined,
    duration: entry.duration ? entry.duration * 1000 : 0, // Convert seconds to milliseconds
  }));

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
      // Stop timer - update existing entry
      const endTime = new Date();

      if (currentEntryId) {
        try {
          updateTimeEntry(currentEntryId, {
            project_name: "Building Dreams",
            end_time: endTime.toISOString(),
          });
        } catch (error) {
          console.error("Error updating time entry:", error);
        }
      }

      setIsRunning(false);
      setStartTime(null);
      setElapsedTime(0);
      setCurrentEntryId(null);
    } else {
      // Start timer - create new entry
      const startTime = new Date();
      setIsRunning(true);
      setStartTime(startTime);

      try {
        const newEntry = await createTimeEntry({
          project_name: "Building Dreams",
          start_time: startTime.toISOString(),
        });

        setCurrentEntryId(newEntry.id);
      } catch (error) {
        console.error("Error creating time entry:", error);
        // Revert state on error
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

    // Actions
    handleStartStop,

    // Computed values
    getTotalDuration,
    getTodaySessionsCount,
    formatTime,
  };
}