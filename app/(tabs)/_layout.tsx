import { Tabs } from 'expo-router';
import React from 'react';
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      initialRouteName="index"
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].icon,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Rankings",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <IconSymbol
                size={focused ? 26 : 24}
                name="chart.bar.fill"
                color={color}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "",
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                height: 70,
                width: 70,
                borderRadius: 100,
                borderWidth: 10,
                borderColor:
                  Colors[(colorScheme as keyof typeof Colors) ?? "light"]
                    .tabBackground,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                elevation: 10,
              }}
            >
              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 100,
                  backgroundColor: Colors[colorScheme ?? "light"].primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconSymbol
                  size={focused ? 28 : 24}
                  name="alarm.fill"
                  color="#ffffff"
                />
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <IconSymbol
                size={focused ? 26 : 24}
                name="person.fill"
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
