// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import EcranPrincipal from '../../components/EcranPrincipal';  // Page principale de gestion des tâches
import TodoDetails from '../../components/TodoDetails';  // Page des détails d'une tâche
import CompletedTasks from '../../components/CompletedTasks';  // Page des tâches terminées
import LoginScreen from '@/components/LoginScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EcranPrincipal" component={EcranPrincipal} />
        <Stack.Screen name="TodoDetails" component={TodoDetails} />
        <Stack.Screen name="CompletedTasks" component={CompletedTasks} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
