import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import React from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Leaderboard() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { data: leaderboardResponse, isLoading } = useLeaderboard();

  const leaderboardData = leaderboardResponse?.data || [];
  const currentUser = leaderboardData.find(entry => entry.is_current_user);

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}h ${m}m`;
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

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Leaderboard
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            See who&apos;s building dreams the most!
          </ThemedText>
        </View>

        {/* Top 3 Podium */}
        <View style={styles.podiumContainer}>
          {/* Second Place */}
          {leaderboardData[1] && (
            <View style={styles.podiumItem}>
              <ThemedView style={[styles.podiumPlace, styles.secondPlace]}>
                <Image
                  source={{ uri: leaderboardData[1].profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(leaderboardData[1].name)}&background=3b82f6&color=fff&size=200` }}
                  style={styles.podiumAvatar}
                />
                <ThemedText style={styles.podiumRank}>🥈</ThemedText>
                <ThemedText style={styles.podiumTime}>
                  {formatTime(leaderboardData[1].total_hours)}
                </ThemedText>
              </ThemedView>
            </View>
          )}

          {/* First Place */}
          {leaderboardData[0] && (
            <View style={styles.podiumItem}>
              <ThemedView style={[styles.podiumPlace, styles.firstPlace]}>
                <Image
                  source={{ uri: leaderboardData[0].profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(leaderboardData[0].name)}&background=3b82f6&color=fff&size=200` }}
                  style={styles.podiumAvatar}
                />
                <ThemedText style={styles.podiumRank}>🥇</ThemedText>
                <ThemedText style={styles.podiumTime}>
                  {formatTime(leaderboardData[0].total_hours)}
                </ThemedText>
              </ThemedView>
            </View>
          )}

          {/* Third Place */}
          {leaderboardData[2] && (
            <View style={styles.podiumItem}>
              <ThemedView style={[styles.podiumPlace, styles.thirdPlace]}>
                <Image
                  source={{ uri: leaderboardData[2].profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(leaderboardData[2].name)}&background=3b82f6&color=fff&size=200` }}
                  style={styles.podiumAvatar}
                />
                <ThemedText style={styles.podiumRank}>🥉</ThemedText>
                <ThemedText style={styles.podiumTime}>
                  {formatTime(leaderboardData[2].total_hours)}
                </ThemedText>
              </ThemedView>
            </View>
          )}
        </View>

        {/* Full Rankings */}
        <ThemedView style={styles.leaderboardCard}>
          <ThemedText type="subtitle" style={styles.cardTitle}>
            Full Rankings
          </ThemedText>
          {leaderboardData.map((entry) => (
            <ThemedView
              key={entry.user_id}
              style={[
                styles.leaderboardItem,
                entry.is_current_user && styles.currentUserItem,
              ]}
            >
              <ThemedText style={styles.rank}>
                {getRankIcon(entry.rank)}
              </ThemedText>
              <Image
                source={{ uri: entry.profile_picture_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(entry.name)}&background=3b82f6&color=fff&size=200` }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{entry.name}</ThemedText>
                <ThemedText
                  style={[
                    styles.userLevel,
                    { color: entry.level_color },
                  ]}
                >
                  {entry.level}
                </ThemedText>
              </View>
              <View style={styles.userStats}>
                <ThemedText style={styles.userTime}>
                  {formatTime(entry.total_hours)}
                </ThemedText>
                <ThemedText style={styles.userStreak}>
                  🔥 {entry.current_streak} day streak
                </ThemedText>
              </View>
            </ThemedView>
          ))}
        </ThemedView>

        {/* Personal Stats */}
        {currentUser && (
          <ThemedView style={styles.statsCard}>
            <ThemedText type="subtitle" style={styles.cardTitle}>
              Your Progress
            </ThemedText>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsLabel}>Current Rank</ThemedText>
              <ThemedText style={styles.statsValue}>#{currentUser.rank}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsLabel}>Level</ThemedText>
              <ThemedText style={styles.statsValue}>{currentUser.level}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsLabel}>Total Focus Time</ThemedText>
              <ThemedText style={styles.statsValue}>{formatTime(currentUser.total_hours)}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statsRow}>
              <ThemedText style={styles.statsLabel}>Current Streak</ThemedText>
              <ThemedText style={styles.statsValue}>🔥 {currentUser.current_streak} days</ThemedText>
            </ThemedView>
          </ThemedView>
        )}
      </SafeAreaView>
    </ScrollView>
  );
}