import { DefaultTheme } from "react-native-paper";

export const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "#277ca5", // blue primary color
      onPrimary: "#FFFFFF", // Text color on primary color
      primaryContainer: "#277ca5", // Light blue for primary container
      onPrimaryContainer: "#000000", // Text color on primary container
  
      secondary: "#64c2ec", // Secondary blue color
      onSecondary: "#000000", // Text color on secondary color
      secondaryContainer: "#64c2ec", // Light blue for secondary container
      onSecondaryContainer: "#0B2531", // Text color on secondary container
  
      background: "#e5f4ff", // Light blue background
      onBackground: "#111111", // Text color on background
      surface: "#FFFFFF", // Surface color
      onSurface: "#212121", // Text color on surface
      surfaceVariant: "#ffffff", // Surface variant color
      elevation: { ...DefaultTheme.colors.elevation, level1: '#ffffff' },
  
      error: "#B00020", // Error color
      onError: "#FFFFFF", // Text color on error color
      errorContainer: "#FDECEA", // Error container color
      onErrorContainer: "#B00020", // Text color on error container

      success: "green", // Success color
    },
  };