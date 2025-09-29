import { useState } from "react";
import {
  useCreateTimeEntry,
  useGetTimeEntries,
  useUpdateTimeEntry,
} from "./use-time-entry";

export function useTimeEntriesOffline() {
  const [isOnline] = useState(true);

  const createTimeEntryMutation = useCreateTimeEntry();
  const updateTimeEntryMutation = useUpdateTimeEntry();
  const {
    data: timeEntriesResponse,
    isLoading,
    refetch,
  } = useGetTimeEntries({ limit: "50" });

  const timeEntries = timeEntriesResponse?.data?.data || [];
  const isSyncing =
    createTimeEntryMutation.isPending || updateTimeEntryMutation.isPending;

  const createTimeEntry = async (data: {
    project_id?: string;
    start_time: string;
  }) => {
    const result = await createTimeEntryMutation.mutateAsync(data);
    // refetch(); // Refresh the list after creating
    return result.data;
  };

  const updateTimeEntry = async (
    id: string,
    data: { end_time: string; duration?: number }
  ) => {
    await updateTimeEntryMutation.mutateAsync({
      id,
      end_time: data.end_time,
    });
    // refetch(); // Refresh the list after updating
  };

  return {
    timeEntries,
    isLoading,
    isOnline,
    isSyncing,
    createTimeEntry,
    updateTimeEntry,
    refreshFromServer: () => refetch(),
  };
}
