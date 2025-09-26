import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface LeaderboardEntry {
  id: string;
  name: string;
  totalTime: number;
  streak: number;
  level: string;
  avatarUrl: string;
  isCurrentUser?: boolean;
}

export default function Leaderboard() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  // Mock leaderboard data
  const leaderboardData: LeaderboardEntry[] = [
    {
      id: "1",
      name: "Dream Builder",
      totalTime: 28800000, // 8 hours in ms
      streak: 15,
      level: "Master",
      avatarUrl: "https://i.pravatar.cc/100?img=1",
      isCurrentUser: true,
    },
    {
      id: "2",
      name: "Code Warrior",
      totalTime: 25200000, // 7 hours
      streak: 12,
      level: "Expert",
      avatarUrl: "https://i.pravatar.cc/100?img=2",
    },
    {
      id: "3",
      name: "Focus Hero",
      totalTime: 21600000, // 6 hours
      streak: 8,
      level: "Pro",
      avatarUrl: "https://i.pravatar.cc/100?img=3",
    },
    {
      id: "4",
      name: "Time Master",
      totalTime: 18000000, // 5 hours
      streak: 6,
      level: "Advanced",
      avatarUrl: "https://i.pravatar.cc/100?img=4",
    },
    {
      id: "5",
      name: "Goal Crusher",
      totalTime: 14400000, // 4 hours
      streak: 4,
      level: "Intermediate",
      avatarUrl: "https://i.pravatar.cc/100?img=5",
    },
  ];

  const formatTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Master":
        return "#ffd700"; // Gold
      case "Expert":
        return "#ff6b6b"; // Red
      case "Pro":
        return "#4ecdc4"; // Teal
      case "Advanced":
        return "#45b7d1"; // Blue
      case "Intermediate":
        return "#96ceb4"; // Green
      default:
        return colors.text;
    }
  };

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
    subtitle: {
      fontSize: 16,
      opacity: 0.7,
    },
    podiumContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "flex-end",
      paddingHorizontal: 20,
      marginBottom: 30,
      height: 180,
    },
    podiumItem: {
      alignItems: "center",
    },
    podiumPlace: {
      flex: 0,
      width: 100,
      height: 140,
      backgroundColor: colors.cardBackground,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginBottom: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    firstPlace: {
      marginBottom: 40,
    },
    secondPlace: {
      marginBottom: 20,
    },
    thirdPlace: {},
    podiumAvatar: {
      width: 50,
      height: 50,
      borderRadius: 50,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    podiumRank: {
      fontSize: 20,
      marginBottom: 4,
    },
    podiumTime: {
      fontSize: 12,
      fontWeight: "600",
      color: colors.primary,
    },
    leaderboardCard: {
      margin: 16,
      marginTop: 0,
      padding: 24,
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 4,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
    },
    leaderboardItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.cardBackground,
    },
    currentUserItem: {
      backgroundColor: colors.primary + "15",
      paddingHorizontal: 16,
      borderRadius: 12,
      marginHorizontal: -16,
    },
    rank: {
      width: 40,
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "center",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginHorizontal: 16,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 4,
    },
    userLevel: {
      fontSize: 12,
      fontWeight: "500",
    },
    userStats: {
      alignItems: "flex-end",
    },
    userTime: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 2,
    },
    userStreak: {
      fontSize: 12,
      opacity: 0.7,
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
  });

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Leaderboard
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            See who's building dreams the most!
          </ThemedText>
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {/* Second Place */}
          <View style={styles.podiumItem}>
            <ThemedView style={[styles.podiumPlace, styles.secondPlace]}>
              <Image
                source={{ uri: leaderboardData[1]?.avatarUrl }}
                style={styles.podiumAvatar}
              />
              <ThemedText style={styles.podiumRank}>🥈</ThemedText>
              <ThemedText style={styles.podiumTime}>
                {formatTime(leaderboardData[1]?.totalTime || 0)}
              </ThemedText>
            </ThemedView>
          </View>

          {/* First Place */}
          <View style={styles.podiumItem}>
            <ThemedView style={[styles.podiumPlace, styles.firstPlace]}>
              <Image
                source={{ uri: leaderboardData[0]?.avatarUrl }}
                style={styles.podiumAvatar}
              />
              <ThemedText style={styles.podiumRank}>🥇</ThemedText>
              <ThemedText style={styles.podiumTime}>
                {formatTime(leaderboardData[0]?.totalTime || 0)}
              </ThemedText>
            </ThemedView>
          </View>

          {/* Third Place */}
          <View style={styles.podiumItem}>
            <ThemedView style={[styles.podiumPlace, styles.thirdPlace]}>
              <Image
                source={{ uri: leaderboardData[2]?.avatarUrl }}
                style={styles.podiumAvatar}
              />
              <ThemedText style={styles.podiumRank}>🥉</ThemedText>
              <ThemedText style={styles.podiumTime}>
                {formatTime(leaderboardData[2]?.totalTime || 0)}
              </ThemedText>
            </ThemedView>
          </View>
        </View>

        {/* Full Rankings */}
        <ThemedView style={styles.leaderboardCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Full Rankings
          </ThemedText>
          {leaderboardData.map((entry, index) => (
            <ThemedView
              key={entry.id}
              style={[
                styles.leaderboardItem,
                entry.isCurrentUser && styles.currentUserItem,
              ]}
            >
              <ThemedText style={styles.rank}>
                {getRankIcon(index + 1)}
              </ThemedText>
              <Image
                source={{ uri: entry.avatarUrl }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{entry.name}</ThemedText>
                <ThemedText
                  style={[
                    styles.userLevel,
                    { color: getLevelColor(entry.level) },
                  ]}
                >
                  {entry.level}
                </ThemedText>
              </View>
              <View style={styles.userStats}>
                <ThemedText style={styles.userTime}>
                  {formatTime(entry.totalTime)}
                </ThemedText>
                <ThemedText style={styles.userStreak}>
                  🔥 {entry.streak} day streak
                </ThemedText>
              </View>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Personal Stats */}
        <ThemedView style={styles.statsCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Your Progress
          </ThemedText>
          <ThemedView style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Current Rank</ThemedText>
            <ThemedText style={styles.statsValue}>#1</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Level</ThemedText>
            <ThemedText style={styles.statsValue}>Master</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Total Focus Time</ThemedText>
            <ThemedText style={styles.statsValue}>8h 0m</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statsRow}>
            <ThemedText style={styles.statsLabel}>Current Streak</ThemedText>
            <ThemedText style={styles.statsValue}>🔥 15 days</ThemedText>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    </ScrollView>
  );
}