import { Text, StyleSheet, View, TextInput, Button, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import menuData from '../storage.json';
import * as ImagePicker from 'expo-image-picker';

// Predefined food categories
const FOOD_TYPES = [
  { label: 'Mains', value: 'mains' },
  { label: 'Starters', value: 'starters' },
  { label: 'Desserts', value: 'desserts' },
  { label: 'Salads', value: 'salads' },
];


export default function Management() {
  // State for all menu items
  const [menuItems, setMenuItems] = useState([]);

  // State for new dish being created
  const [newDish, setNewDish] = useState({
    name: '',
    description: '',
    price: Number(''),
    type: 'mains',
    image: '',
  });

  // State for editing existing dish
  const [editingDish, setEditingDish] = useState(null);
  // Controls visibility of the edit modal
  const [modalVisible, setModalVisible] = useState(false);


  // Load data from AsyncStorage when component mounts
  // If nothing is stored yet, fall back to bundled storage.json
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = await AsyncStorage.getItem('menuItems');
        if (storedData) {
          setMenuItems(JSON.parse(storedData));
        } else {
          setMenuItems(menuData);
        }
      } catch (error) {
        console.error('Error loading menu items:', error);
      }
    };
    loadData();
  }, []);



  // Save to AsyncStorage whenever menuItems changes
  useEffect(() => {
    const saveData = async () => {
      try {
        await AsyncStorage.setItem('menuItems', JSON.stringify(menuItems));
      } catch (error) {
        console.error('Error saving menu items:', error);
      }
    };
    if (menuItems.length > 0) {
      saveData();
    }
  }, [menuItems]);


   //  Add a new dish
  const handleAddDish = () => {
    if (!newDish.name || !newDish.price) {
      Alert.alert('Please enter at least a name and price for the dish.');
      return;
    }
    setMenuItems([
      ...menuItems,
      { ...newDish, id: Date.now().toString() } // unique ID
    ]);
    // Reset form
    setNewDish({ name: '', description: '', price: '', type: 'mains', image: '' });
  };

  // 🔹 Remove a dish by ID
  const handleRemoveDish = (id) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
    setModalVisible(false);
  };

  // 🔹 Edit an existing dish
  const handleEditDish = () => {
    setMenuItems(menuItems.map(item =>
      item.id === editingDish.id ? editingDish : item
    ));
    setModalVisible(false);
  };

   // 🔹 Select image for new dish
  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setNewDish({ ...newDish, image: result.assets[0].uri });
    }
  };

  // 🔹 Select image for editing dish
  const handleSelectEditImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setEditingDish({ ...editingDish, image: result.assets[0].uri });
    }
  };



    //  Select image for editing dish
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/*  List of existing menu items */}
      <Text style={styles.header}>Menu Items</Text>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.listItem}
          onPress={() => {
            setEditingDish({ ...item }); // open modal with dish data
            setModalVisible(true);
          }}
        >

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={[styles.dishImage, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={styles.dishImage}
                />
              ) : (
                <Text style={{ color: '#aaa', fontSize: 10 }}>No Image</Text>
              )}
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      {/* Form to add new dishes */}
      <Text style={styles.header}>Add New Dish</Text>
      <View style={styles.dishContainer}>
        <TextInput
          style={styles.input}
          placeholder="Dish Name"
          value={newDish.name}
          onChangeText={text => setNewDish({ ...newDish, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={newDish.description}
          onChangeText={text => setNewDish({ ...newDish, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={newDish.price}
          onChangeText={text => setNewDish({ ...newDish, price: text })}
          keyboardType="numeric"
        />
       {/* Image selector */}
        <Button title="Select Image" onPress={handleSelectImage} />
        {newDish.image ? (
          <Image source={{ uri: newDish.image }} style={styles.previewImage} />
        ) : (
          <Text style={{ color: '#aaa', marginVertical: 6 }}>No image selected</Text>
        )}

        {/* Food type selector buttons */}
        <View style={styles.typeRow}>
          {FOOD_TYPES.map(type => (
            <TouchableOpacity
              key={type.value}
              style={[
                styles.typeButton,
                newDish.type === type.value && styles.typeButtonActive,
              ]}
              onPress={() => setNewDish({ ...newDish, type: type.value })}
            >
              <Text style={[
                styles.typeButtonText,
                newDish.type === type.value && styles.typeButtonTextActive,
              ]}>
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Button title="Add Dish" onPress={handleAddDish} />
      </View>

      {/* Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {editingDish && (
              <>
                <Text style={styles.header}>Edit Dish</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Dish Name"
                  value={editingDish.name}
                  onChangeText={text => setEditingDish({ ...editingDish, name: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={editingDish.description}
                  onChangeText={text => setEditingDish({ ...editingDish, description: text })}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Price"
                  value={editingDish.price}
                  onChangeText={text => setEditingDish({ ...editingDish, price: text })}
                  keyboardType="string"
                />
                {/* 👇 Image selector for editing */}
                <Button style={styles.imgBtn} title="Change Image" onPress={handleSelectEditImage} />
                {editingDish.image ? (
                  <Image source={{ uri: editingDish.image }} style={styles.previewImage} />
                ) : (
                  <Text style={{ color: '#aaa', marginVertical: 6 }}>No image selected</Text>
                )}


                {/* Food type selector buttons */}
                <View style={styles.typeRow}>
                  {FOOD_TYPES.map(type => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeButton,
                        editingDish.type === type.value && styles.typeButtonActive,
                      ]}
                      onPress={() => setEditingDish({ ...editingDish, type: type.value })}
                    >
                      <Text style={[
                        styles.typeButtonText,
                        editingDish.type === type.value && styles.typeButtonTextActive,
                      ]}>
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}

                  {/* Save/Delete/Cancel buttons */}
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Button title="Save" color="#000000ff" onPress={handleEditDish} />
                  <Button title="Delete" color="#000000ff" onPress={() => handleRemoveDish(editingDish.id)} />
                  <Button title="Cancel" color="#000000ff" onPress={() => setModalVisible(false)} />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 90,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
    textAlign: 'center',
  },
  listItem: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginBottom: 12,
    padding: 10,
    elevation: 1,
     borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#00000017',
  },
  dishContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginBottom: 40,
    padding: 12,
    elevation: 2,
     borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#00000017',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  typeRow: {
    flexDirection: 'row',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
    marginBottom: 4,
  },
  typeButtonActive: {
    backgroundColor: '#000000ff',
  },
  typeButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  dishImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 0,
    alignSelf: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  type: {
    fontSize: 12,
    color: '#666',
  },
  price: {
    fontSize: 14,
    color: '#000000ff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    elevation: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
  },
  
});