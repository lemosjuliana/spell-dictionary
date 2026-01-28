import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function SpellDetail() {
   const router = useRouter();
  const { name, description } = useLocalSearchParams<{
    name: string;
    description: string;
  }>();

  return (
    <View style={styles.container}>
  
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{description || "No description available"}</Text>
      </View>
    </View>
  );
}

/////////////////////////////////////////

const styles = StyleSheet.create({
  header: {
    height: 60, // same height as typical header
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#6F1D1B"
  },
  title: {
    fontFamily: "Harry-Potter",
    fontSize: 36,
    textAlign: "center",
    marginBottom: 20,
    color: "#fbe9bb"
  },
    content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    textAlign: "center",
    color: "#fbe9bb"
  },
  backButton: { 
    padding: 10, 
    paddingTop: 10,
    alignSelf: "flex-start" 
  },

  backButtonText: { 
    fontSize: 20, 
    color: "#fbe9bb" 
  },
});
