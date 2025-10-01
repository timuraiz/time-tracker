import { useImagePicker } from "@/hooks/use-image-picker";
import { useUploadProfilePicture } from "@/hooks/use-profile";
import { supabase } from "@/lib/supabase.web";
import { useState } from "react";
import { Alert } from "react-native";

export function useProfileActions() {
  const { pickImage } = useImagePicker();
  const uploadProfilePictureMutation = useUploadProfilePicture();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleUploadPicture = async () => {
    const image = await pickImage();
    if (!image) return;

    try {
      const response = await uploadProfilePictureMutation.mutateAsync(image);
      if (response.error) {
        throw response.error;
      }
    } catch (error) {
      console.error("Error uploading picture:", error);
      Alert.alert("Error", "Failed to upload profile picture");
    }
  };

  const handleSignOut = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          setIsSigningOut(true);
          const { error } = await supabase.auth.signOut();
          if (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to sign out");
          }
          setIsSigningOut(false);
        },
      },
    ]);
  };

  return {
    handleUploadPicture,
    handleSignOut,
    isSigningOut,
  };
}
