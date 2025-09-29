import AsyncStorage from '@react-native-async-storage/async-storage';
import { CreateTimeEntryResponse } from './api';

export interface LocalTimeEntry extends CreateTimeEntryResponse {
  syncStatus: 'synced' | 'pending' | 'failed';
  localId: string; // UUID for offline entries
}

export interface PendingAction {
  id: string;
  type: 'create' | 'update';
  data: any;
  timestamp: number;
}

const STORAGE_KEYS = {
  TIME_ENTRIES: 'timeEntries',
  PENDING_ACTIONS: 'pendingActions',
};

class TimeEntriesStorage {
  // Get all time entries from storage
  async getTimeEntries(): Promise<LocalTimeEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading time entries:', error);
      return [];
    }
  }

  // Save time entries to storage
  async saveTimeEntries(entries: LocalTimeEntry[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(entries));
    } catch (error) {
      console.error('Error saving time entries:', error);
    }
  }

  // Add new time entry (optimistic)
  async addTimeEntry(entry: Omit<LocalTimeEntry, 'localId' | 'syncStatus'>): Promise<LocalTimeEntry> {
    const entries = await this.getTimeEntries();
    const newEntry: LocalTimeEntry = {
      ...entry,
      localId: `local_${Date.now()}_${Math.random()}`,
      syncStatus: 'pending',
    };

    const updatedEntries = [newEntry, ...entries];
    await this.saveTimeEntries(updatedEntries);

    return newEntry;
  }

  // Update existing time entry
  async updateTimeEntry(id: string, updates: Partial<LocalTimeEntry>): Promise<void> {
    const entries = await this.getTimeEntries();
    const updatedEntries: LocalTimeEntry[] = entries.map(entry =>
      entry.id === id || entry.localId === id
        ? { ...entry, ...updates, syncStatus: 'pending' as const }
        : entry
    );
    await this.saveTimeEntries(updatedEntries);
  }

  // Mark entry as synced
  async markAsSynced(localId: string, serverResponse: CreateTimeEntryResponse): Promise<void> {
    const entries = await this.getTimeEntries();
    const updatedEntries = entries.map(entry =>
      entry.localId === localId
        ? { ...entry, ...serverResponse, syncStatus: 'synced' as const }
        : entry
    );
    await this.saveTimeEntries(updatedEntries);
  }

  // Get pending actions queue
  async getPendingActions(): Promise<PendingAction[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_ACTIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading pending actions:', error);
      return [];
    }
  }

  // Add action to queue
  async addPendingAction(action: Omit<PendingAction, 'id' | 'timestamp'>): Promise<void> {
    const actions = await this.getPendingActions();
    const newAction: PendingAction = {
      ...action,
      id: `action_${Date.now()}_${Math.random()}`,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(
      STORAGE_KEYS.PENDING_ACTIONS,
      JSON.stringify([...actions, newAction])
    );
  }

  // Remove action from queue
  async removePendingAction(actionId: string): Promise<void> {
    const actions = await this.getPendingActions();
    const filteredActions = actions.filter(action => action.id !== actionId);
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_ACTIONS, JSON.stringify(filteredActions));
  }

  // Replace local storage with server data (initial sync)
  async syncFromServer(serverEntries: CreateTimeEntryResponse[]): Promise<void> {
    const localEntries: LocalTimeEntry[] = serverEntries.map(entry => ({
      ...entry,
      localId: entry.id,
      syncStatus: 'synced',
    }));
    await this.saveTimeEntries(localEntries);
  }
}

export const timeEntriesStorage = new TimeEntriesStorage();