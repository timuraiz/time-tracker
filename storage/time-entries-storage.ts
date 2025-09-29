import AsyncStorage from "@react-native-async-storage/async-storage";
import { TimeEntry } from "../hooks/use-timer";

const TIME_ENTRIES_STORAGE_KEY = "timeEntries";

export class TimeEntriesStorage {
  static async saveTimeEntries(timeEntries: TimeEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TIME_ENTRIES_STORAGE_KEY, JSON.stringify(timeEntries));
    } catch (error) {
      console.error("Failed to save time entries to storage:", error);
    }
  }

  static async getTimeEntries(): Promise<TimeEntry[]> {
    try {
      const stored = await AsyncStorage.getItem(TIME_ENTRIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert stored date strings back to Date objects
        return parsed.map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : undefined,
        }));
      }
      return [];
    } catch (error) {
      console.error("Failed to load time entries from storage:", error);
      return [];
    }
  }

  static async clearTimeEntries(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TIME_ENTRIES_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear time entries from storage:", error);
    }
  }

  static async updateTimeEntry(updatedEntry: TimeEntry): Promise<void> {
    try {
      const timeEntries = await this.getTimeEntries();
      const updatedEntries = timeEntries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      );
      await this.saveTimeEntries(updatedEntries);
    } catch (error) {
      console.error("Failed to update time entry in storage:", error);
    }
  }

  static async addTimeEntry(newEntry: TimeEntry): Promise<void> {
    try {
      const timeEntries = await this.getTimeEntries();
      await this.saveTimeEntries([newEntry, ...timeEntries]);
    } catch (error) {
      console.error("Failed to add time entry to storage:", error);
    }
  }

  static async removeTimeEntry(entryId: string): Promise<void> {
    try {
      const timeEntries = await this.getTimeEntries();
      const filteredEntries = timeEntries.filter((entry) => entry.id !== entryId);
      await this.saveTimeEntries(filteredEntries);
    } catch (error) {
      console.error("Failed to remove time entry from storage:", error);
    }
  }

  static async getUnfinishedEntry(): Promise<TimeEntry | null> {
    try {
      const timeEntries = await this.getTimeEntries();
      return timeEntries.find((entry) => !entry.endTime) || null;
    } catch (error) {
      console.error("Failed to get unfinished entry from storage:", error);
      return null;
    }
  }

  static async getTodayEntries(): Promise<TimeEntry[]> {
    try {
      const timeEntries = await this.getTimeEntries();
      const today = new Date().toDateString();
      return timeEntries.filter((entry) => entry.startTime.toDateString() === today);
    } catch (error) {
      console.error("Failed to get today entries from storage:", error);
      return [];
    }
  }
}