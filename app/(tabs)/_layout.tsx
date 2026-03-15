import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Colors } from '../../src/constants/theme';
import { Ionicons } from '@expo/vector-icons';

type TabIconProps = {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
};

function TabIcon({ name, color, focused }: TabIconProps) {
  return <Ionicons name={name} size={24} color={color} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary,
        tabBarStyle: {
          backgroundColor: isDark ? Colors.dark.surface : Colors.light.surface,
          borderTopColor: isDark ? Colors.dark.border : Colors.light.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontFamily: 'PlusJakartaSans_600SemiBold',
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: 0.5,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'map' : 'map-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="meals"
        options={{
          title: 'Meals',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'restaurant' : 'restaurant-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="errands"
        options={{
          title: 'Errands',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'checkbox' : 'checkbox-outline'} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: 'Photos',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? 'images' : 'images-outline'} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
