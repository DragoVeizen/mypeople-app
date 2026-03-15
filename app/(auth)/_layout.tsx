import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/theme';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
