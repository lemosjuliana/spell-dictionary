import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

export default function Splash() {
  const router = useRouter();
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    // Prevent auto-hiding the native splash screen
    SplashScreen.preventAutoHideAsync();

    // Simulate API loading (replace with your real API call)
    const loadApi = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1800));
      setApiLoaded(true);
      SplashScreen.hideAsync();
      router.replace("/");
    };
    loadApi();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/splash-icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <ActivityIndicator size="large" color="#FAEFD2" style={{ marginTop: 32 }} />
      <Text style={styles.footer}>
        Developed by Juliana Lemos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6F1D1B",
    justifyContent: "center",
    alignItems: "center",
  },


  icon: {
    width: 160,
    height: 160,
    marginBottom: 24,
  },

  footer: {
    position: "absolute",
    bottom: 40,
    fontSize: 14,
    color: "#FAEFD2",
    opacity: 0.8,
  },
});
