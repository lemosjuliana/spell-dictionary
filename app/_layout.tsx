import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Text } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Harry-Potter": require("../assets/fonts/HarryPotter-ov4z.ttf"),
  });

  if (!fontsLoaded){
    return <Text>Loading...</Text>
  }
  return <Stack />;
}
