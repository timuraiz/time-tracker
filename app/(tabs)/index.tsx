import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TimeEntry {
  id: string;
  project: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);

  const colors = Colors[colorScheme ?? "light"];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 24,
      paddingTop: 60,
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: "bold",
      marginBottom: 8,
    },
    date: {
      fontSize: 16,
      opacity: 0.7,
    },
    timerCard: {
      margin: 16,
      padding: 32,
      borderRadius: 24,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      alignItems: "center",
    },
    projectSection: {
      alignItems: "center",
      marginBottom: 32,
    },
    projectName: {
      fontSize: 20,
      fontWeight: "600",
    },
    timerDisplay: {
      marginBottom: 40,
      paddingHorizontal: 16,
      paddingVertical: 20,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      backgroundColor: colors.cardBackground,
    },
    timerText: {
      fontSize: 50,
      fontWeight: "bold",
      fontFamily: "monospace",
      color: colors.primary,
      textAlign: "center",
      includeFontPadding: false,
      lineHeight: 48,
    },
    startStopButton: {
      paddingHorizontal: 48,
      paddingVertical: 16,
      borderRadius: 50,
      minWidth: 120,
      alignItems: "center",
    },
    startButton: {
      backgroundColor: colors.success,
    },
    stopButton: {
      backgroundColor: colors.danger,
    },
    buttonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
      letterSpacing: 1,
    },
    statsCard: {
      margin: 16,
      marginTop: 8,
      padding: 24,
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 4,
    },
    statsTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
      backgroundColor: colors.cardBackground,
    },
    statsLabel: {
      fontSize: 16,
      opacity: 0.7,
    },
    statsValue: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary,
    },
    entriesCard: {
      margin: 16,
      marginTop: 8,
      padding: 24,
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 32,
    },
    entriesTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
    },
    entryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    entryInfo: {
      flex: 1,
      backgroundColor: colors.cardBackground,
    },
    entryProject: {
      fontSize: 16,
      fontWeight: "500",
      marginBottom: 4,
    },
    entryTime: {
      fontSize: 14,
      opacity: 0.6,
    },
    entryDuration: {
      fontSize: 16,
      fontWeight: "600",
      fontFamily: "monospace",
      color: colors.primary,
    },
  });

  useEffect(() => {
    let interval: number;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const mins = Math.floor(seconds / 60);
    const hours = Math.floor(mins / 60);
    return `${hours.toString().padStart(2, "0")}:${(mins % 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      const endTime = new Date();
      const newEntry: TimeEntry = {
        id: Date.now().toString(),
        project: "Building Dreams",
        startTime: startTime!,
        endTime,
        duration: elapsedTime,
      };
      setTimeEntries((prev) => [newEntry, ...prev]);
      setIsRunning(false);
      setStartTime(null);
      setElapsedTime(0);
    } else {
      setIsRunning(true);
      setStartTime(new Date());
    }
  };

  const getTotalDuration = () => {
    const today = new Date().toDateString();
    return timeEntries
      .filter((entry) => entry.startTime.toDateString() === today)
      .reduce((total, entry) => total + entry.duration, 0);
  };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <ThemedView style={styles.timerCard}>
          <ThemedView style={styles.projectSection}>
            <ThemedText type="subtitle" style={styles.projectName}>
              Building Dreams
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.timerDisplay}>
            <ThemedText style={styles.timerText}>
              {formatTime(elapsedTime)}
            </ThemedText>
          </ThemedView>

          <TouchableOpacity
            style={[
              styles.startStopButton,
              isRunning ? styles.stopButton : styles.startButton,
            ]}
            onPress={handleStartStop}
          >
            <ThemedText style={styles.buttonText}>
              {isRunning ? "STOP" : "START"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.statsCard}>
          <ThemedText type="subtitle" style={styles.statsTitle}>
            Today's Summary
          </ThemedText>
          <ThemedView style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Total Time</ThemedText>
            <ThemedText style={styles.statsValue}>
              {formatTime(getTotalDuration())}
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Sessions</ThemedText>
            <ThemedText style={styles.statsValue}>
              {
                timeEntries.filter(
                  (entry) =>
                    entry.startTime.toDateString() === new Date().toDateString()
                ).length
              }
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.entriesCard}>
          <ThemedText type="subtitle" style={styles.entriesTitle}>
            Recent Sessions
          </ThemedText>
          {timeEntries.slice(0, 5).map((entry) => (
            <ThemedView key={entry.id} style={styles.entryRow}>
              <ThemedView style={styles.entryInfo}>
                <ThemedText style={styles.entryProject}>
                  {entry.project}
                </ThemedText>
                <ThemedText style={styles.entryTime}>
                  {entry.startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {entry.endTime?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </ThemedText>
              </ThemedView>
              <ThemedText style={styles.entryDuration}>
                {formatTime(entry.duration)}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </SafeAreaView>
    </ScrollView>
  );
}
