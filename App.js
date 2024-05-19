import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import EtatDesLieux from './screens/EtatDesLieux';
import EtatDesLieuxProcess from './screens/EtatDesLieuxProcess';
import EtatDesLieuxProcessSortie from './screens/EtatDesLieuxProcessSortie';
import EtatPiece from './screens/EtatPiece';
import EtatPiecesortie from './screens/EtatPiecesortie';
import { StyleSheet } from 'react-native';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EtatDesLieux" component={EtatDesLieux} />
        <Stack.Screen name="EtatDesLieuxProcess" component={EtatDesLieuxProcess} />
        <Stack.Screen name="EtatPiece" component={EtatPiece} />
        <Stack.Screen name="EtatPiecesortie" component={EtatPiecesortie} />
        <Stack.Screen name="EtatDesLieuxProcessSortie" component={EtatDesLieuxProcessSortie} />
      </Stack.Navigator>
      <StatusBar style="auto"/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
