import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BASE_URL_API } from '../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [logements, setLogements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLogements();
  }, []);

  const fetchLogements = async () => {
    try {
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
          action: 'GetLogementEtatDesLieux',
          token: token,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setLogements(data.logements);
      } else {
        setError(data.message);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des logements : ', error);
      setError('Une erreur est survenue lors de la récupération des logements.');
      setLoading(false);
    }
  };

  const handleViewEtatDesLieux = async (idReservation) => {
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
          action: 'infoetatreservation',
          token: token,
          idreservation: idReservation,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        navigation.navigate('EtatDesLieux', { etatDesLieux: data.etatlieux });
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des informations sur l\'état des lieux : ', error);
      setError('Une erreur est survenue lors de la récupération des informations sur l\'état des lieux.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Erreur: {error}</Text>
      </View>
    );
  }

  if (logements.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Vous n'avez aucun état des lieux à faire</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {logements.map((logement) => (
        <TouchableOpacity
          key={logement.id_logement}
          style={styles.card}
          onPress={() => handleViewEtatDesLieux(logement.id_reservation)}
        >
          <Text style={styles.title}>{logement.nom_logement}</Text>
          <Text>{logement.rue_logement}, {logement.cp_logement} {logement.ville_logement}</Text>
          <Text>{logement.nb_pieces}</Text>
          <Text>{logement.rue_logement}</Text>
          <Text>{logement.cp_logement}</Text>
          <Text>{logement.ville_logement}</Text>
          <Text>date du début de la reservation : {logement.date_debut_demande}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
