import { useState, useRef, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av"; 



type Spell = {
  name: string,
  description: string,
};

///////////////////////////////////////

export default function Index() {
  const router = useRouter();
  const [spells, setSpells] = useState<Spell[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [loading, setLoading] = useState(true);
  const soundRef = useRef<Audio.Sound | null>(null);
  const buttonSoundRef = useRef<Audio.Sound | null>(null);


//////////////////////////////////////

  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const res = await fetch("https://hp-api.onrender.com/api/spells");
        const data: Spell[] = await res.json();
        setSpells(data);
        pickRandomSpell(data);
      } catch (error) {
        console.error("Error fetching spells:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  useEffect(() => {
  const loadSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/spell.mp3")
    );

      const { sound: buttonSound } = await Audio.Sound.createAsync(
      require("../../assets/sounds/button.mp3")
    );

    soundRef.current = sound;
    buttonSoundRef.current = buttonSound;
  };

  loadSound();

  return () => {
    soundRef.current?.unloadAsync();
    buttonSoundRef.current?.unloadAsync();
  };
}, []);


//////////////////////////////////////

const pickRandomSpell = (spelllist: Spell[]) => {
  if (spelllist.length === 0) return;
  const randomIndex = Math.floor(Math.random() * spelllist.length);
  setSelectedSpell(spelllist[randomIndex]);
};

const handlePress = async () => {
  try {
    await buttonSoundRef.current?.replayAsync();
    pickRandomSpell(spells);
  } catch (error) {
    console.log("Button sound error:", error);
  }
};


const playSoundAndNavigate = async () => {
  if (!selectedSpell || !soundRef.current) return;

  try {
    await soundRef.current.replayAsync();

    router.push({
      pathname: "/spell/[name]",
      params: {
        name: selectedSpell.name,
        description: selectedSpell.description,
      },
    });
  } catch (error) {
    console.log("Sound/navigation error:", error);
  }
};


//////////////////////////////////////
   return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="brown" />
      ) : (
        <>
          <TouchableOpacity
            style={styles.spellBox}
            disabled={!selectedSpell}
            onPress={playSoundAndNavigate}
          >
            <Text style={styles.spellText}>
              {selectedSpell?.name || "No spell yet"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handlePress}
            disabled={!spells.length}
          >
            <Text style={styles.buttonText}>Generate Spell</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c8a468",
    
  },
  title: {
    fontFamily: "Harry-Potter",
    fontSize: 30,
    marginBottom: 80,
    color: "#432818", 
  },
  spellBox: {
    padding: 20,
    minWidth: 250,
    alignItems: "center",
    
  },
  spellText: {
    fontSize: 40,
    fontFamily: "Harry-Potter",
    textAlign: "center",
    color: "#432818",
  },
  button: {
    backgroundColor: "#6F1D1B",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 25,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#faefd2",
    fontSize: 18,
    fontWeight: "bold",
  },
});
