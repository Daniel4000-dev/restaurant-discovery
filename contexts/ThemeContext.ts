import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, ColorSchemeName } from 'react-native';

const THEME_STORAGE_KEY = '@theme_preference';

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  overlay: string;
  shadow: string;
}

const lightColors: ThemeColors = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  primary: '#0EA5E9',
  secondary: '#8B5CF6',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  card: '#FFFFFF',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const darkColors: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#38BDF8',
  secondary: '#A78BFA',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  card: '#1E293B',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  info: '#60A5FA',
  overlay: 'rgba(0, 0, 0, 0.7)',
  shadow: 'rgba(0, 0, 0, 0.3)',
};

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  const loadTheme = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        setThemeState(stored as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, []);

  useEffect(() => {
    loadTheme();
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => subscription.remove();
  }, [loadTheme]);

  const setTheme = useCallback(async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const activeColorScheme = useMemo(
    () => (theme === 'system' ? systemColorScheme || 'light' : theme),
    [theme, systemColorScheme]
  );

  const isDark = activeColorScheme === 'dark';
  const colors = useMemo(
    () => (isDark ? darkColors : lightColors),
    [isDark]
  );

  return useMemo(
    () => ({
      theme,
      setTheme,
      isDark,
      colors,
      activeColorScheme,
    }),
    [theme, setTheme, isDark, colors, activeColorScheme]
  );
});
