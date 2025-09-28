import { supabase } from '@/lib/supabase.web'
import { ThemedText } from '@/components/themed-text'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, ActivityIndicator, Alert, View } from 'react-native'

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const colorScheme = useColorScheme()
  const colors = Colors[colorScheme ?? 'light']

  async function onSignOutButtonPress() {
    setIsLoading(true)
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error signing out:', error)
      Alert.alert('Error', 'Failed to sign out')
    }
    setIsLoading(false)
  }

  const styles = StyleSheet.create({
    button: {
      backgroundColor: colors.danger,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 200,
      shadowColor: colors.danger,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      lineHeight: 20,
    },
    icon: {
      marginRight: 8,
      fontSize: 16,
    },
  })

  return (
    <TouchableOpacity
      style={[styles.button, isLoading && styles.buttonDisabled]}
      onPress={onSignOutButtonPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {isLoading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <>
            <ThemedText style={styles.icon}>🚪</ThemedText>
            <ThemedText style={styles.buttonText}>Sign Out</ThemedText>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}