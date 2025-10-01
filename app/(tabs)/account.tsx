import { LoadingSpinner } from "@/components/loading-spinner";
import ProjectsModal from "@/components/projects-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useGetProfile, useUserData, useUserStats } from "@/hooks/use-profile";
import { useProfileActions } from "@/hooks/use-profile-actions";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SettingsItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  onPress: () => void;
}

export default function Profile() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const { isLoading } = useGetProfile();
  const userData = useUserData();
  const userStats = useUserStats();
  const { handleUploadPicture, handleSignOut, isSigningOut } =
    useProfileActions();
  const [showProjectsModal, setShowProjectsModal] = useState(false);

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
    online: {
      fontSize: 20,
      backgroundColor: colors.cardBackground,
    },
    profileCard: {
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
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    userName: {
      fontSize: 24,
      fontWeight: "bold",
    },
    userEmail: {
      fontSize: 16,
      opacity: 0.7,
      marginBottom: 8,
    },
    levelBadge: {
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
      marginBottom: 8,
    },
    levelText: {
      fontSize: 14,
      fontWeight: "600",
      color: "#fff",
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    infoText: {
      fontSize: 14,
      opacity: 0.6,
      marginHorizontal: 4,
    },
    statsSection: {
      margin: 16,
      marginTop: 8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 16,
      paddingHorizontal: 8,
    },
    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    statCard: {
      width: "48%",
      padding: 20,
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 12,
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      opacity: 0.7,
      textAlign: "center",
    },
    settingsSection: {
      margin: 16,
      marginTop: 8,
    },
    settingsCard: {
      padding: 24,
      borderRadius: 16,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingIcon: {
      fontSize: 20,
      marginRight: 16,
      width: 24,
      textAlign: "center",
    },
    settingContent: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 2,
    },
    settingSubtitle: {
      fontSize: 14,
      opacity: 0.6,
    },
    chevron: {
      fontSize: 16,
      opacity: 0.4,
    },
  });

  if (isLoading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ThemedView>
    );
  }

  const settingsItems: SettingsItem[] = [
    {
      id: "projects",
      title: "Manage Projects",
      subtitle: "Create and edit projects",
      icon: "📁",
      onPress: () => setShowProjectsModal(true),
    },
    // {
    //   id: "notifications",
    //   title: "Notifications",
    //   subtitle: "Manage your alerts",
    //   icon: "🔔",
    //   onPress: () => console.log("Notifications"),
    // },
    // {
    //   id: "goals",
    //   title: "Daily Goals",
    //   subtitle: "Set your targets",
    //   icon: "🎯",
    //   onPress: () => console.log("Goals"),
    // },
    // {
    //   id: "themes",
    //   title: "Themes",
    //   subtitle: "Customize appearance",
    //   icon: "🎨",
    //   onPress: () => console.log("Themes"),
    // },
    // {
    //   id: "export",
    //   title: "Export Data",
    //   subtitle: "Download your progress",
    //   icon: "📊",
    //   onPress: () => console.log("Export"),
    // },
    // {
    //   id: "help",
    //   title: "Help & Support",
    //   subtitle: "Get assistance",
    //   icon: "❓",
    //   onPress: () => console.log("Help"),
    // },
    {
      id: "signout",
      title: "Sign Out",
      subtitle: "Sign out of your account",
      icon: "🚪",
      onPress: handleSignOut,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView>
        {/* Profile Card */}
        <ThemedView style={styles.profileCard}>
          <TouchableOpacity onPress={handleUploadPicture} activeOpacity={0.7}>
            <Image source={{ uri: userData.avatarUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <ThemedText style={styles.userName}>{userData.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{userData.email}</ThemedText>
          <View
            style={[
              styles.levelBadge,
              { backgroundColor: userData.levelColor },
            ]}
          >
            <ThemedText style={styles.levelText}>{userData.level}</ThemedText>
          </View>
          <View style={styles.userInfo}>
            <ThemedText style={styles.infoText}>
              Rank: #{userData.rank}
            </ThemedText>
            <ThemedText style={styles.infoText}>•</ThemedText>
            <ThemedText style={styles.infoText}>
              Joined {userData.joinedDate}
            </ThemedText>
          </View>
        </ThemedView>

        {/* Statistics */}
        <View style={styles.statsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Your Progress
          </ThemedText>
          <View style={styles.statsGrid}>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {userStats.totalHours}h
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Hours</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {userStats.totalSessions}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Total Sessions</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {userStats.currentStreak}
              </ThemedText>
              <ThemedText style={styles.statLabel}>Current Streak</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statCard}>
              <ThemedText style={styles.statValue}>
                {userStats.averagePerDay}h
              </ThemedText>
              <ThemedText style={styles.statLabel}>Daily Average</ThemedText>
            </ThemedView>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.settingsSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Settings
          </ThemedText>
          <ThemedView style={styles.settingsCard}>
            {settingsItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingItem,
                  index === settingsItems.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
                onPress={item.onPress}
              >
                <ThemedText style={styles.settingIcon}>{item.icon}</ThemedText>
                <View style={styles.settingContent}>
                  <ThemedText style={styles.settingTitle}>
                    {item.title}
                  </ThemedText>
                  {item.subtitle && (
                    <ThemedText style={styles.settingSubtitle}>
                      {item.subtitle}
                    </ThemedText>
                  )}
                </View>
                {item.id === "signout" && isSigningOut ? (
                  <LoadingSpinner size={18} />
                ) : (
                  <ThemedText style={styles.chevron}>›</ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </ThemedView>
        </View>

        {/* Projects Modal */}
        <ProjectsModal
          visible={showProjectsModal}
          onClose={() => setShowProjectsModal(false)}
        />
      </SafeAreaView>
    </ScrollView>
  );
}
