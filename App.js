import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StackProvider, useStack } from './src/context/StackContext';
import StackScreen from './src/screens/StackScreen';
import AnalysisScreen from './src/screens/AnalysisScreen';
import NutrientsScreen from './src/screens/NutrientsScreen';
import { Colors, Spacing } from './src/theme';
const Tab = createBottomTabNavigator();
function TabBar({ state, navigation }) {
  const { getSummary } = useStack();
  const summary = getSummary();
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const badge = route.name === 'Analysis' && summary.risks > 0;
        const icons = { Stack: '⬛', Analysis: '🔬', Nutrients: '📊' };
        return (
          <TouchableOpacity key={route.key} style={styles.tabItem} onPress={() => navigation.navigate(route.name)}>
            <View>
              <Text style={[styles.tabIcon, focused && styles.tabIconActive]}>{icons[route.name]}</Text>
              {badge && <View style={styles.badge}><Text style={styles.badgeText}>{summary.risks}</Text></View>}
            </View>
            <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator tabBar={p => <TabBar {...p} />} screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Stack" component={StackScreen} />
        <Tab.Screen name="Analysis" component={AnalysisScreen} />
        <Tab.Screen name="Nutrients" component={NutrientsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default function App() { return <StackProvider><AppNavigator /></StackProvider>; }
const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: 'rgba(13,8,24,0.97)', borderTopWidth: 1, borderTopColor: 'rgba(155,109,255,0.15)', paddingTop: 10, paddingBottom: 28, paddingHorizontal: 24 },
  tabItem: { flex: 1, alignItems: 'center', gap: 4 },
  tabIcon: { fontSize: 20, opacity: 0.4 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 10, fontWeight: '500', color: '#8A8A9C' },
  tabLabelActive: { color: '#9B6DFF' },
  badge: { position: 'absolute', top: -4, right: -8, backgroundColor: '#FF5C7A', borderRadius: 999, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  badgeText: { fontSize: 9, fontWeight: '700', color: '#fff' },
});