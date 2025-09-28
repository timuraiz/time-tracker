import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import AuthProvider from '@/providers/auth-providers';
import { useAuthContext } from '@/hooks/use-auth-context';
import { View, ActivityIndicator, Text } from 'react-native';
import AuthForm from '@/components/auth-form';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AppContent() {
  const { isLoggedIn, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return <AuthForm />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <AppContent />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
