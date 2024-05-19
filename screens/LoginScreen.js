import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BASE_URL_API } from '../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'connection',
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('userId', data.id.toString());
        await AsyncStorage.setItem('userType', data.type);
        navigation.navigate('Home');
      } else {
        Alert.alert('Erreur', data.message);
      }
    } catch (error) {
      console.error('Erreur de connexion : ', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la connexion. Veuillez réessayer.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.logo}>Real Estate</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Nom d'utilisateur"
          onChangeText={setUsername}
          value={username}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.inputText}
          placeholder="Mot de passe"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: 50,
    marginBottom: 40,
  },
  inputView: {
    width: '80%',
    backgroundColor: '#dfe4ea',
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: 'center',
    padding: 20,
  },
  inputText: {
    height: 50,
    color: 'black',
  },
  loginBtn: {
    width: '80%',
    backgroundColor: '#007bff',
    borderRadius: 25,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'white',
  },
}); 