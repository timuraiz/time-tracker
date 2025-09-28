import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { supabase } from '@/lib/supabase.web'
import React, { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  async function signInWithOtp() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setPendingEmail(email);
      setIsOtpMode(true);
      Alert.alert(
        "OTP Sent",
        "Check your email for the 6-digit verification code!"
      );
    }
    setIsLoading(false);
  }

  async function signUpWithOtp() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        data: {
          name: name,
        },
      },
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setPendingEmail(email);
      setIsOtpMode(true);
      Alert.alert(
        "OTP Sent",
        "Check your email for the 6-digit verification code!"
      );
    }
    setIsLoading(false);
  }

  async function verifyOtp() {
    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token: otp,
      type: isSignUp ? "signup" : "email",
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success",
        isSignUp ? "Account created successfully!" : "Signed in successfully!"
      );
      setIsOtpMode(false);
      setOtp("");
      setPendingEmail("");
    }
    setIsLoading(false);
  }

  const handleSubmit = () => {
    if (isOtpMode) {
      if (!otp) {
        Alert.alert("Error", "Please enter the verification code");
        return;
      }
      verifyOtp();
      return;
    }

    if (isSignUp) {
      if (!email || !name) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }
      signUpWithOtp();
    } else {
      if (!email) {
        Alert.alert("Error", "Please enter your email");
        return;
      }
      signInWithOtp();
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: 24,
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 24,
      backgroundColor: colors.cardBackground,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      overflow: "hidden",
    },
    logo: {
      width: 80,
      height: 80,
      resizeMode: "cover",
    },
    logoText: {
      fontSize: 32,
      fontWeight: "bold",
      color: "#fff",
      lineHeight: 34,
    },
    welcomeText: {
      fontSize: 28,
      lineHeight: 28,
      fontWeight: "bold",
      marginBottom: 8,
      textAlign: "center",
    },
    subtitleText: {
      fontSize: 16,
      opacity: 0.7,
      textAlign: "center",
      marginBottom: 8,
    },
    form: {
      width: "100%",
      maxWidth: 400,
      alignSelf: "center",
    },
    formCard: {
      padding: 32,
      borderRadius: 24,
      backgroundColor: colors.cardBackground,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      marginBottom: 24,
    },
    inputContainer: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color: colors.text,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      backgroundColor: colors.cardBackground,
      color: colors.text,
    },
    inputFocused: {
      borderColor: colors.primary,
      borderWidth: 2,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "600",
    },
    switchContainer: {
      alignItems: "center",
      padding: 24,
    },
    switchButton: {
      padding: 12,
    },
    switchText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: "500",
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 24,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      marginHorizontal: 16,
      fontSize: 14,
      opacity: 0.6,
    },
    otpContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    otpInput: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 12,
      padding: 16,
      fontSize: 18,
      backgroundColor: colors.cardBackground,
      color: colors.text,
      textAlign: "center",
      letterSpacing: 4,
      fontWeight: "600",
    },
    backButton: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: 16,
    },
    backButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "500",
    },
    otpInfo: {
      textAlign: "center",
      marginBottom: 24,
      opacity: 0.7,
      lineHeight: 20,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require("../assets/images/icon.png")}
                style={styles.logo}
              />
            </View>
            <ThemedText style={styles.welcomeText}>
              {isOtpMode
                ? "Verify Your Email"
                : isSignUp
                ? "Create Account"
                : "Welcome Back"}
            </ThemedText>
            <ThemedText style={styles.subtitleText}>
              {isOtpMode
                ? `Enter the verification code sent to ${pendingEmail}`
                : isSignUp
                ? "Join thousands tracking their time efficiently"
                : "Sign in to continue your time tracking journey"}
            </ThemedText>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <ThemedView style={styles.formCard}>
              {isOtpMode ? (
                <>
                  <ThemedText style={styles.otpInfo}>
                    Please enter the 6-digit verification code that was sent to
                    your email address.
                  </ThemedText>

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>
                      Verification Code
                    </ThemedText>
                    <TextInput
                      style={[styles.input, styles.otpInput]}
                      placeholder="●●●●●●"
                      placeholderTextColor={colors.icon}
                      value={otp}
                      onChangeText={setOtp}
                      keyboardType="number-pad"
                      maxLength={6}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <ThemedText style={styles.buttonText}>
                        Verify Code
                      </ThemedText>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, styles.backButton]}
                    onPress={() => {
                      setIsOtpMode(false);
                      setOtp("");
                      setPendingEmail("");
                    }}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    <ThemedText style={styles.backButtonText}>
                      Back to {isSignUp ? "Sign Up" : "Sign In"}
                    </ThemedText>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  {isSignUp && (
                    <View style={styles.inputContainer}>
                      <ThemedText style={styles.inputLabel}>Name</ThemedText>
                      <TextInput
                        style={[styles.input]}
                        placeholder="Enter your name"
                        placeholderTextColor={colors.icon}
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        autoCorrect={false}
                        editable={!isLoading}
                      />
                    </View>
                  )}

                  <View style={styles.inputContainer}>
                    <ThemedText style={styles.inputLabel}>Email</ThemedText>
                    <TextInput
                      style={[styles.input]}
                      placeholder="Enter your email"
                      placeholderTextColor={colors.icon}
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoading}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    activeOpacity={0.8}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <ThemedText style={styles.buttonText}>
                        {isSignUp
                          ? "Send Verification Code"
                          : "Send Sign In Code"}
                      </ThemedText>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </ThemedView>

            {/* Switch Mode */}
            {!isOtpMode && (
              <View style={styles.switchContainer}>
                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => setIsSignUp(!isSignUp)}
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.switchText}>
                    {isSignUp
                      ? "Already have an account? Sign In"
                      : "Don't have an account? Sign Up"}
                  </ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}