import { Stack } from "expo-router";
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();
export default function Layout() {
  const [fontsLoaded] = useFonts({
    "Harry-Potter": require("../assets/fonts/HarryPotter-ov4z.ttf"),
  });

  const [spellsLoaded, setSpellsLoaded] = useState(false);

    useEffect(() => {
    fetch("https://hp-api.onrender.com/api/spells")
      .then((res) => res.json())
      .then(() => {
        setSpellsLoaded(true);
      })
      .catch((err) => {
        console.error("Spell preload failed:", err);
        setSpellsLoaded(true); 
      });
  }, []); 
  
  useEffect(() => {
    if (fontsLoaded && spellsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, spellsLoaded]);

  if (!fontsLoaded || !spellsLoaded) {
    return null; 
  }
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" />
      <Stack.Screen name="(tabs)/index" />
      <Stack.Screen name="(tabs)/spell/[name]" />
    </Stack>
  );
}
