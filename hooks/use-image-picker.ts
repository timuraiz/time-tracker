import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

interface ImageAsset {
  uri: string;
  fileName: string;
  mimeType: string;
}

export function useImagePicker() {
  const pickImage = async (): Promise<ImageAsset | null> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library"
      );
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      fileName: asset.fileName || "image.jpg",
      mimeType: asset.mimeType || "image/jpeg",
    };
  };

  return { pickImage };
}
