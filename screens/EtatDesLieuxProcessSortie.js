import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { BASE_URL_API, CHEMIN_PHOTO_BASE } from '../apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EtatDesLieuxProcess({ route, navigation }) {
  const { etatDesLieux } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    fetchLogementPieces();
  }, []);

  const fetchLogementPieces = async () => {
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
          action: 'GetLogementPieces',
          token: token,
          idreservation: etatDesLieux.id_reservation,
        }),
      });
  
      const data = await response.json();
  
      if (data.status === 'success') {
        setPieces(data.pieces);
      } else {
        setError(data.message);
      }
  
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des pièces du logement : ', error);
      setError('Une erreur est survenue lors de la récupération des pièces du logement.');
      setLoading(false);
    }
  };

  const handlePiecePress = (pieceId) => {
    console.log(etatDesLieux);
    navigation.navigate('EtatPiecesortie', { pieceId, etatDesLieux });
  };

  const handleConfirmation = () => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous confirmer la finalisation de cette étape d\'état des lieux ?',
      [
        {
          text: 'Non',
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: () => confirmEtatLieux(),
        },
      ],
      { cancelable: false }
    );
  };

  const confirmEtatLieux = async () => {
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
          action: 'modifystatusetatlieux',
          token,
          id_etat: etatDesLieux.id_etat,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Rediriger vers HomeScreen
        navigation.navigate('Home');
        // Afficher message de confirmation
        Alert.alert('Confirmation', 'L\'état des lieux a été envoyé et doit être visualisé par le commercial.');
      } else {
        // Afficher message d'erreur
        Alert.alert('Erreur', data.message);
      }
    } catch (error) {
      console.error('Erreur lors de la confirmation de l\'état des lieux : ', error);
      // Afficher message d'erreur
      Alert.alert('Erreur', 'Une erreur est survenue lors de la confirmation de l\'état des lieux.');
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TouchableOpacity onPress={handleConfirmation} style={styles.button}>
        <Text style={styles.buttonText}>Valider l'état</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Liste des pièces du logement :</Text>
      {pieces.map((piece) => (
        <TouchableOpacity key={piece.id_piece} onPress={() => handlePiecePress(piece.id_piece)}>
          <View style={styles.pieceCard}>
            <Text style={styles.pieceTitle}>{piece.libelle_piece.replace(/\d+/g, '')}</Text>
            <View style={styles.pieceImageContainer}>
              {piece.chemin_photo ? (
                <Image source={{ uri: `${CHEMIN_PHOTO_BASE}${piece.chemin_photo}` }} style={styles.pieceImage} />
              ) : (
                <Image source={{ uri: `${CHEMIN_PHOTO_BASE}placeholder.jpg` }} style={styles.pieceImage} />
              )}
            </View>
            <Text style={styles.pieceInfo}>Surface: {piece.surface} m² </Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pieceCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
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
  pieceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pieceImageContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  pieceImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  pieceInfo: {
    fontSize: 16,
  },
});