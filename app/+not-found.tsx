import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { MapPinOff } from "lucide-react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Page Not Found" }} />
      <View style={styles.container}>
        <MapPinOff size={64} color="red" />
        <Text style={styles.title}>Page not found</Text>
        <Text style={styles.description}>
          The page you&apos;re looking for doesn&apos;t exist.
        </Text>

        <Link href="/discover" style={styles.link}>
          <Text style={styles.linkText}>Go to Discover</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#F8FAFC",
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#0F172A",
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 24,
  },
  link: {
    marginTop: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    backgroundColor: "#0EA5E9",
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFFFFF",
  },
});
