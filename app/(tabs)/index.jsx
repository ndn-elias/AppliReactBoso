import React from 'react';
import { Provider } from 'react-redux'; // Import du Provider Redux
import store from './store'; // Chemin vers ton store
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../../components/LoginScreen';
import EcranPrincipal from '../../components/EcranPrincipal';
import TodoDetails from '../../components/TodoDetails';
import CompletedTasks from '../../components/CompletedTasks';
import CompletedTaskDetails from '@/components/CompletedTaskDetails';
import { ScrollView } from 'react-native-gesture-handler';

const Stack = createStackNavigator();

export default function App() {
  return (
    
    <Provider store={store}> {/* Enveloppe toute l'application */}
      <NavigationContainer independent={true}>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          
          <Stack.Screen name="EcranPrincipal" component={EcranPrincipal} />
          <Stack.Screen name="TodoDetails" component={TodoDetails} />
          <Stack.Screen name="CompletedTasks" component={CompletedTasks} />
          <Stack.Screen name="CompletedTaskDetails" component={CompletedTaskDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
