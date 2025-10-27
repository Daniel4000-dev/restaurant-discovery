import { StyleSheet, Text, View, Pressable } from "react-native";
import { Heart, Moon, Sun, Smartphone } from "lucide-react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function FavoritesScreen() {
  const { theme, setTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();

  const themeOptions: { value: 'light' | 'dark' | 'system'; label: string; Icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', Icon: Sun },
    { value: 'dark', label: 'Dark', Icon: Moon },
    { value: 'system', label: 'System', Icon: Smartphone },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <Heart size={64} color={colors.border} />
      <Text style={[styles.title, { color: colors.text }]}>Your Favorites</Text>
      <Text style={[styles.text, { color: colors.textSecondary }]}>
        Save restaurants you love for quick access later
      </Text>

      <View style={styles.themeSection}>
        <Text style={[styles.themeTitle, { color: colors.text }]}>Theme</Text>
        <View style={styles.themeOptions}>
          {themeOptions.map(({ value, label, Icon }) => (
            <Pressable
              key={value}
              onPress={() => setTheme(value)}
              style={({ pressed }) => [
                styles.themeButton,
                { 
                  backgroundColor: theme === value ? colors.primary : colors.surface,
                  borderColor: colors.border,
                },
                pressed && styles.themeButtonPressed,
              ]}
              accessibilityLabel={`Switch to ${label} theme`}
              accessibilityRole="button"
              accessibilityState={{ selected: theme === value }}
            >
              <Icon 
                size={24} 
                color={theme === value ? colors.surface : colors.text}
              />
              <Text 
                style={[
                  styles.themeLabel, 
                  { color: theme === value ? colors.surface : colors.text }
                ]}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  themeSection: {
    marginTop: 48,
    width: "100%",
    maxWidth: 400,
  },
  themeTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginBottom: 16,
    textAlign: "center",
  },
  themeOptions: {
    flexDirection: "row",
    gap: 12,
  },
  themeButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  themeButtonPressed: {
    opacity: 0.8,
  },
  themeLabel: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
});
