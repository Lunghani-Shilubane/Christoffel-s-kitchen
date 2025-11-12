import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Info from './components/Info';
import Menu from './components/Menu';
import Payment from './components/Payment';
import Management from './components/Management';
import * as NavigationBar from 'expo-navigation-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';



const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarStyle: {
          position: 'absolute',
          bottom: 50,
          left: 20,
          right: 20,
          borderWidth: 1,
          borderColor: '#000000ff',
          borderRadius: 16,
          height: 50, 
          backgroundColor: '#fff',
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          paddingBottom: 0,
        },

        tabBarIconStyle: {
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          
        },
      }}
    >
      
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant-outline" color={color} size={22} />
          ),
        }}
      />
     
      <Tab.Screen
        name="Payment"
        component={Payment}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" color={color} size={22} />
          ),
        }}
      />

      <Tab.Screen
        name="Management"
        component={Management}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={22} />
          ),
        }}
      />

       <Tab.Screen
        name="Info"
        component={Info}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="information-circle-outline" color={color} size={22} />
              
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  React.useEffect(() => {
    NavigationBar.setVisibilityAsync('hidden');
  }, []);

  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
}
