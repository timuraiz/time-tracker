import { useColorScheme as useNativeColorScheme } from "react-native";

export function useColorScheme() {
  const colorScheme = useNativeColorScheme();
  console.log("🎨 Current color scheme:", colorScheme);
  return colorScheme;
}
