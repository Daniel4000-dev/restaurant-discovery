import { View, Button, Alert } from "react-native";
import { seedRestaurants } from "@/scripts/seedRestaurants";

export function SeedScreen() {
  const handleSeed = async () => {
    try {
      await seedRestaurants();
      Alert.alert("Success", "✅ Mock restaurants uploaded to Firestore!");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "❌ Failed to seed restaurants.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Button disabled title="Upload Restaurants Data" onPress={handleSeed} />
    </View>
  );
}
