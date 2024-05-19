import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL_API } from '../apiConfig';

export default function EtatDesLieux({ route, navigation }) {
  const { etatDesLieux } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [etatReservation, setEtatReservation] = useState(null);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    if (etatDesLieux.length === 0) {
      setLoading(false);
      return;
    }
    fetchEtatReservation();
    getUserType();
  }, []);

  const getUserType = async () => {
    try {
      const type = await AsyncStorage.getItem('userType');
      if (type) {
        setUserType(type);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du type d\'utilisateur : ', error);
    }
  };

  const fetchEtatReservation = async () => {
    try {
      if (!etatDesLieux || etatDesLieux.length === 0) {
        setLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Token manquant');
        setLoading(false);
        return;
      }
      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'infoetatreservation',
          token: token,
          idreservation: etatDesLieux.id_reservation,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setEtatReservation(data.etatlieux);
      } else {
        setError(data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'état de la réservation : ', error);
      setError('Une erreur est survenue lors de la récupération de l\'état de la réservation.');
      setLoading(false);
    }
  };

  const handleFaireEtatEntree = () => {
    navigation.navigate('EtatDesLieuxProcess', { etatDesLieux });
  };

  const handleFaireEtatSortie = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        setError('Token manquant');
        return;
      }
      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'candoout',
          token: token,
          idreservation: etatDesLieux.id_reservation,
        }),
      });

      const data = await response.json();

      if (data.status === 'success' && data.candoout === 'true') {
        navigation.navigate('EtatDesLieuxProcessSortie', { etatDesLieux });
      } else {
        setError(data.message || 'Impossible de faire l\'état des lieux de sortie.');
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'état de la réservation : ', error);
      setError('Une erreur est survenue lors de la récupération de l\'état de la réservation.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Erreur: {error}</Text>
      </View>
    );
  }

  if (!etatReservation) {
    return (
      <View style={styles.container}>
        <Text style={styles.infoText}>Vous devez attendre l'état des lieux du commercial</Text>
      </View>
    );
  }

  const isCommercial = userType === 'commercial';
  let message = '';

  switch (etatReservation.statut) {
    case 0:
      message = isCommercial ? 'Le commercial doit faire le premier état des lieux.' : 'Vous devez attendre que l\'état des lieux du commercial soit fait.';
      break;
    case 1:
      message = !isCommercial ? 'Le client doit faire le retour de l\'état des lieux.' : 'Vous devez attendre le retour du client';
      break;
    case 3:
    case 4:
      message = !isCommercial ? 'C\'est au client de faire l\'état des lieux de sortie.' : 'Vous devez attendre l\'état des lieux de sortie du client';
      break;
    case 5:
      message = isCommercial ? 'Le client fait un retour sur l\'état des lieux' : 'le client fait sont retour sur l\'état des lieux';
      navigation.navigate('Home');
      break;
    default:
      message = '';
      break;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Détails de l'état des lieux :</Text>
      <Text style={styles.infoText}>{message}</Text>
      {etatReservation.statut === 0 && isCommercial && (
        <Button title="Faire l'état des lieux d'entrée" onPress={handleFaireEtatEntree} />
      )}
      {etatReservation.statut >= 3 && (
        <Button title="Faire l'état des lieux de sortie" onPress={handleFaireEtatSortie} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});