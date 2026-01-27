import { useState, useEffect } from "react";
import { Text, View, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";

type Spell = {
  name: string,
  description: string,
};

///////////////////////////////////////

export default function Index() {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [randomSpell, setRandomSpell] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

//////////////////////////////////////

const pickRandomSpell = (spelllist: Spell[]) => {
  if (spelllist.length === 0) return;
  const randomIndex = Math.floor(Math.random() * spelllist.length);
  setRandomSpell(spelllist[randomIndex].name);
};

const handlePress = () => pickRandomSpell(spells);

//////////////////////////////////////
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Spell Dictionary</Text>

      {loading ? (
        <ActivityIndicator size="large" color="brown" />
      ) : (
        <>
          <View style={styles.spellBox}>
            <Text style={styles.spellText}>
              {randomSpell || "No spell yet"}
            </Text>
          </View>

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
  },
  title: {
    fontFamily: "Harry-Potter",
    fontSize: 30,
    marginBottom: 80,
  },
  spellBox: {
    padding: 20,
    minWidth: 250,
    alignItems: "center",
  },
  spellText: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
  },
  button: {
    backgroundColor: "brown",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
