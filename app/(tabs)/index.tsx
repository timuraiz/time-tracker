import ProjectsModal from "@/components/projects-modal";
import { ThemedOneLineText } from "@/components/themed-one-line-text";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useProjects } from "@/hooks/use-projects";
import { useTimer } from "@/hooks/use-timer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? ("light" as keyof typeof Colors)];

  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const { projects } = useProjects();
  const selectedProject =
    projects.find((p) => p.id === selectedProjectId) || projects[0];

  const {
    isRunning,
    elapsedTime,
    currentEntryId,
    timeEntries,
    isLoadingEntries,
    isOnline,
    handleStartStop,
    getTotalDuration,
    getTodaySessionsCount,
    formatTime,
  } = useTimer(selectedProject);

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
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      alignItems: "center",
      backgroundColor: colors.cardBackground,
    },
    projectSection: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 32,
      padding: 12,
      paddingHorizontal: 50,
      paddingLeft: 70,
      borderRadius: 8,
    },
    projectNameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },
    projectColorIndicator: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    recentColorIndicator: {
      width: 8,
      height: 8,
      borderRadius: 6,
    },
    projectName: {
      fontSize: 20,
      fontWeight: "600",
      textAlign: "center",
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
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 4,
      backgroundColor: colors.cardBackground,
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
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 4,
      marginBottom: 32,
      backgroundColor: colors.cardBackground,
    },
    entriesTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
      backgroundColor: colors.cardBackground,
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
      backgroundColor: colors.cardBackground,
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
    loadingContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.cardBackground,
    },
    loadingText: {
      marginLeft: 10,
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    emptyContainer: {
      alignItems: "center",
      padding: 20,
      backgroundColor: colors.cardBackground,
    },
    emptyText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    entriesHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: colors.cardBackground,
    },
    statusIndicators: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    offlineIndicator: {
      backgroundColor: "#ff6b6b",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    offlineText: {
      fontSize: 12,
      color: "white",
      fontWeight: "600",
    },
  });

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <ThemedView style={styles.timerCard}>
          <TouchableOpacity
            style={styles.projectSection}
            onPress={() => setShowProjectsModal(true)}
          >
            <View style={styles.projectNameContainer}>
              {selectedProject?.color && (
                <View
                  style={[
                    styles.projectColorIndicator,
                    { backgroundColor: selectedProject.color },
                  ]}
                />
              )}
              <ThemedOneLineText type="subtitle" style={styles.projectName}>
                {selectedProject?.name || "Select Project"}
              </ThemedOneLineText>
            </View>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={colors.icon}
            />
          </TouchableOpacity>

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
            Today&apos;s Summary
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
              {getTodaySessionsCount()}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.entriesCard}>
          <ThemedView style={styles.entriesHeader}>
            <ThemedText type="subtitle" style={styles.entriesTitle}>
              Recent Sessions
            </ThemedText>
            <ThemedView style={styles.statusIndicators}>
              {!isOnline && (
                <ThemedView style={styles.offlineIndicator}>
                  <ThemedText style={styles.offlineText}>Offline</ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </ThemedView>
          {isLoadingEntries ? (
            <ThemedView style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <ThemedText style={styles.loadingText}>
                Loading sessions...
              </ThemedText>
            </ThemedView>
          ) : timeEntries.length === 0 ? (
            <ThemedView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>No sessions yet</ThemedText>
            </ThemedView>
          ) : (
            timeEntries.slice(0, 5).map((entry, index) => (
              <ThemedView
                key={entry.id || `entry-${index}`}
                style={styles.entryRow}
              >
                <ThemedView style={styles.entryInfo}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <View
                      style={[
                        styles.recentColorIndicator,
                        { backgroundColor: entry.color },
                      ]}
                    />
                    <ThemedOneLineText style={styles.entryProject}>
                      {entry.project}
                    </ThemedOneLineText>
                  </View>
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
                  {entry.endTime
                    ? formatTime(entry.duration)
                    : entry.id === currentEntryId
                    ? formatTime(elapsedTime)
                    : formatTime(entry.duration)}
                </ThemedText>
              </ThemedView>
            ))
          )}
        </ThemedView>
      </SafeAreaView>

      <ProjectsModal
        visible={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        onProjectSelect={(projectId) => {
          setSelectedProjectId(projectId);
          setShowProjectsModal(false);
        }}
        readOnly={true}
      />
    </ScrollView>
  );
}
