import React, { useState, useEffect } from 'react';
import { View, Text, Button, Modal, ScrollView, TouchableOpacity, Image, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback, FlatList  } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL_API } from '../apiConfig';
import { CHEMIN_PHOTO_BASE } from '../apiConfig';

export default function EtatLieux({ route }) {
  const { pieceId } = route.params;
  const { etatDesLieux } = route.params;
  const { id_etat, statut } = etatDesLieux;
  const [selectedRating, setSelectedRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [idUser, setIdUser] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [selectedRatingEquipement, setSelectedRatingEquipement] = useState(0);
  const [selectedEquipementId, setSelectedEquipementId] = useState(null);
  const [equipements, setEquipements] = useState([]);
  const [Ratingpiece, SetRatingPIece] = useState(0);
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    getidfromtoken();
    getequipementfrompiece();
    getpiecerating();
    getConversation();
  }, []);

  

  const getidfromtoken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      if (!token) {
        setError('Token manquant');
        (false);
        return;
      }

      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getidfromtoken',
          token: token,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setIdUser(data.id_user);
        console.log(idUser);
      } else {
        setError(data.message);
      }
      (false);
    } catch (error) {

      (false);
    }
  };




  const getequipementfrompiece = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      if (!token) {
        setError('Token manquant');
        (false);
        return;
      }

      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getequipementfrompiece',
          token: token,
          idpiece: pieceId,
        }),
      });

      console.log(pieceId);
      const data = await response.json();

      if (data.status === 'success') {
        console.log(data);
        setEquipements(data.equipements);
      } else {
        setError(data.message);
      }
      (false);
    } catch (error) {

      (false);
    }
  };

  const rate = (stars) => {
    setSelectedRating(stars);
  };

  const updateRating = () => {
    console.log("Note mise à jour: " + selectedRating);
  };

  const openModal = (id, name) => {
    console.log("Ouverture du modal pour : " + name);
    setModalVisible(true);
    setSelectedEquipementId(id);
  };

  const closeModal = () => {
    setModalVisible(false);
    setPhotoUri(null);
  };

  const cancel = () => {
    console.log("Annuler");
    closeModal();
  };

  const getpiecerating = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      if (!token) {
        setError('Token manquant');
        (false);
        return;
      }

      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getstartpiece',
          token: token,
          id_piece:pieceId,
          id_etat:id_etat,
          type:"entree",
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        SetRatingPIece(data.note);
        console.log(data);
        setSelectedRating(data.note);
      } else {
        console.log(data.message);
        setError(data.message);
      }
      (false);
    } catch (error) {

      (false);
    }
  };

  const updatepiecerating = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      if (!token) {
        setError('Token manquant');
        (false);
        return;
      }

      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updatenotepiece',
          token: token,
          id_piece:pieceId,
          id_etat:id_etat,
          note:selectedRating,
          type:"entree",
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        console.log(data);
        alert(data.message);
      } else {
        console.log(data.message);
        setError(data.message);
        alert(data.message);
      }
      (false);
    } catch (error) {

      (false);
    }
  };

  const getConversation = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("Token manquant.");
        return;
      }
      const response = await fetch(`${BASE_URL_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'getconversationetat',
          token: token,
          id_etat: id_etat,
          idpiece: pieceId,
          type:"entree",
        }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log("Réponse de l'API conversation:", json);
        if (json.status === 'success') {
          setConversation(json.conversation);
        } else {
          console.error(json.message);
        }
      } else {
        console.error("Erreur lors de la récupération des conversations.");
      }
    } catch (error) {
      console.error("Erreur catch :", error);
    }
  };

  const send = async () => {
    console.log("Envoyer");
  
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.error("Token manquant.");
        alert("Token manquant.");
        return;
      }
  
      const formData = new FormData();
      if (photoUri) {
        formData.append('photo', {
          uri: photoUri,
          type: 'image/jpeg',
          name: 'photo.jpg',
        });
      }
  
      formData.append('token', token);
      formData.append('idUser', idUser);
      formData.append('commentaire', commentaire);
      formData.append('note', selectedRatingEquipement.toString());
      formData.append('idEquipement', selectedEquipementId);
      formData.append('type', "entree");
      formData.append('idpiece', pieceId);
      formData.append('idEtat', id_etat);
      console.log(commentaire);
      console.log(selectedRatingEquipement.toString());
  
      const response = await fetch('https://immovc.axiz.io/ApiEtatPiece.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.ok) {
        const json = await response.json();
        console.log("Réponse de l'API:", json);
        if (json.success) {
          alert(json.message);
          setSelectedRatingEquipement = 0;
          getConversation();
        } else {
          alert(json.message);
        }
      } else {
        alert("Equipement envoyé avec succès sans photo");
      }
    } catch (error) {
      console.error("Erreur catch :", error);
      alert("Erreur catch  : " + error.message);
    }
    closeModal();
  };


  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('L\'application a besoin d\'accéder à la caméra pour fonctionner correctement.');
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.assets && result.assets.length > 0 && result.assets[0].uri) {
      console.log("Voici l'URI de l'image sélectionnée : " + result.assets[0].uri);
      setPhotoUri(result.assets[0].uri);
    } else {
      console.log('Sélection d\'image annulée ou l\'URI est vide.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>Notation de la pièce</Text>
        <View style={styles.ratings}>
          {[1, 2, 3, 4, 5].map((stars) => (
            <TouchableOpacity key={stars} onPress={() => rate(stars)}>
              <View style={[styles.rating, stars <= selectedRating && styles.selected]}>
                <Text>{stars}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Mettre à jour la note" onPress={updatepiecerating} />
      </View>

      <View style={styles.equipmentContainer}>
        <FlatList
          horizontal
          data={equipements}
          keyExtractor={(item) => item.id_equipement.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => openModal(item.id_equipement, item.nom_equipement)}>
              <View style={styles.equipment}>
                <Text>{item.nom_equipement}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Ajouter un commentaire"
          placeholderTextColor="gray"
          onChangeText={(text) => setCommentaire(text)}
          multiline={true}
        />
        <View style={styles.ratings}>
          {[1, 2, 3, 4, 5].map((stars) => (
            <TouchableOpacity key={stars} onPress={() => setSelectedRatingEquipement(stars)}>
              <View style={[styles.rating, stars <= selectedRatingEquipement && styles.selected]}>
                <Text>{stars}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Prendre une photo" onPress={takePhoto} />
        {photoUri && <Image source={{ uri: photoUri }} style={styles.photoPreview} />}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Button title="Annuler" onPress={cancel} />
          <Button title="Envoyer" onPress={send} />
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>

<View style={styles.conversation}>
        <FlatList
          data={conversation}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.message, item.id_commercial ? styles.right : styles.left]}>
              <Text>{item.id_commercial ? 'Commercial:' : 'Client:'}</Text>
              <Text>{item.message}</Text>
              <Text>Note: {item.noteco}/5</Text>
              <Text>Date de publication: {item.datepost}</Text>
              {item.chemin_photo && <Image source={{ uri: `${CHEMIN_PHOTO_BASE}${item.chemin_photo}` }} style={styles.photoPreview} />}
            </View>
          )}
        />
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  ratings: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  rating: {
    width: 50,
    height: 50,
    backgroundColor: 'gray',
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  selected: {
    backgroundColor: 'gold',
  },
  equipmentContainer: {
    flexDirection: 'row',
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 10,
    color: 'black',
  },
  equipment: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  close: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  photoPreview: {
    width: 200,
    height: 200,
    backgroundColor: 'lightgray',
    marginVertical: 10,
  },
  conversation: {
    flex: 1,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  left: {
    backgroundColor: '#cce5ff',
    alignSelf: 'flex-start',
  },
  right: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-end',
  },
});