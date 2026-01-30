import { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";

type Spell = {
  name: string;
  description: string;
};

export default function Index() {
  const router = useRouter();

  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [matchedSpell, setMatchedSpell] = useState<Spell | null>(null);
  const [visible, setVisible] = useState(false);

  const slideAnim = useRef(new Animated.Value(300)).current;

  const spellSoundRef = useRef<Audio.Sound | null>(null);
  const buttonSoundRef = useRef<Audio.Sound | null>(null);

  // Fetch spells
  useEffect(() => {
    const fetchSpells = async () => {
      try {
        const res = await fetch("https://hp-api.onrender.com/api/spells");
        const data: Spell[] = await res.json();
        setSpells(data);
      } catch (error) {
        console.error("Error fetching spells:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpells();
  }, []);

  // Load sounds
  useEffect(() => {
    const loadSounds = async () => {
      const { sound: spellSound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/spell.mp3")
      );

      const { sound: buttonSound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/button.mp3")
      );

      spellSoundRef.current = spellSound;
      buttonSoundRef.current = buttonSound;
    };

    loadSounds();

    return () => {
      spellSoundRef.current?.unloadAsync();
      buttonSoundRef.current?.unloadAsync();
    };
  }, []);

  // Spell matcher
  const findSpellByAction = (query: string) => {
    const words = query.toLowerCase().split(" ");

    return spells.find(spell =>
      words.some(word =>
        spell.description.toLowerCase().includes(word)
      )
    );
  };

  // Search handler
  const handleSearch = async () => {
    await buttonSoundRef.current?.replayAsync();
    const match = findSpellByAction(query);
    setMatchedSpell(match ?? null);

    if (match) {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const closeCard = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setVisible(false));
  };

  // Tap spell → sound + navigate
  const playSoundAndNavigate = async () => {
    if (!matchedSpell || !spellSoundRef.current) return;

    await spellSoundRef.current.replayAsync();

    router.push({
      pathname: "/spell/[name]",
      params: {
        name: matchedSpell.name,
        description: matchedSpell.description,
      },
    });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="brown" />
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="What do you want to do?"
            placeholderTextColor="#6b4f3f"
            value={query}
            onChangeText={setQuery}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleSearch}
            disabled={!query}
          >
            <Text style={styles.buttonText}>Find Spell</Text>
          </TouchableOpacity>

          {!matchedSpell && query.length > 0 && (
            <Text style={styles.noResult}>
              No spell matches that action
            </Text>
          )}
        </>
      )}

      {/* Slide-up spell card */}
      <Modal transparent visible={visible} animationType="none">
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.card,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeCard}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={playSoundAndNavigate}
              activeOpacity={0.8}
            >
              <Text style={styles.spellText}>
                {matchedSpell?.name}
              </Text>

              <Text style={styles.description}>
                {matchedSpell?.description}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#c8a468",
    paddingTop: 120,
  },

  input: {
    width: 280,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#faefd2",
    color: "#432818",
    fontSize: 16,
    marginBottom: 16,
  },

  button: {
    backgroundColor: "#6F1D1B",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginBottom: 30,
    alignItems: "center",
  },

  buttonText: {
    color: "#faefd2",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  spellBox: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    minWidth: 280,
    alignItems: "center",
    backgroundColor: "#faefd2",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },

  spellText: {
    fontSize: 42,
    paddingTop: 30,
    fontFamily: "Harry-Potter",
    textAlign: "center",
    color: "#faefd2",
  },

  description: {
    marginTop: 12,
    fontSize: 16,
    textAlign: "center",
    color: "#faefd2",
    lineHeight: 22,
  },

  noResult: {
    marginTop: 20,
    fontSize: 16,
    color: "#6F1D1B",
    fontStyle: "italic",
  },

  overlay: {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "flex-end",
},

card: {
  backgroundColor: "#6F1D1B",
  borderTopLeftRadius: 24,
  borderTopRightRadius: 24,
  padding: 28,
  minHeight: 550,
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 10,
  elevation: 10,
},

closeButton: {
  position: "absolute",
  right: 16,
  top: 16,
  zIndex: 10,
},

closeText: {
  fontSize: 22,
  fontWeight: "bold",
  color: "#faefd2",
},

});
