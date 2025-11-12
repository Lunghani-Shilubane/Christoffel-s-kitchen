import { Text, StyleSheet, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, { Component } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import menuData from '../storage.json';

const FOOD_TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Mains', value: 'mains' },
  { label: 'Starters', value: 'starters' },
  { label: 'Desserts', value: 'desserts' },
  { label: 'Salads', value: 'salads' },
];

const imageMap = {
  "assets/images/chicken_alfredo.jpg": require('../assets/images/chicken_alfredo.jpg'),
  "assets/images/lamb_shank.jpg": require('../assets/images/lamb_shank.jpg'),
  "assets/images/caprese_salad.jpg": require('../assets/images/caprese_salad.jpg'),
  "assets/images/seafood_paella.jpg": require('../assets/images/seafood_paella.jpg'),
  "assets/images/lava_cake.jpg": require('../assets/images/lava_cake.jpg'),
  "assets/images/bruschetta.jpg": require('../assets/images/bruschetta.jpg'),
  "assets/images/french_onion_soup.jpg": require('../assets/images/french_onion_soup.jpg'),
  "assets/images/greek_salad.jpg": require('../assets/images/greek_salad.jpg'),
  "assets/images/tiramisu.jpg": require('../assets/images/tiramisu.jpg'),
  "assets/images/stuffed_mushrooms.jpg": require('../assets/images/stuffed_mushrooms.jpg'),
  "assets/images/duck_confit.jpg": require('../assets/images/duck_confit.jpg'),
  "assets/images/caesar_salad.jpg": require('../assets/images/caesar_salad.jpg'),
  "assets/images/risotto.jpg": require('../assets/images/risotto.jpg'),
  "assets/images/salmon.jpg": require('../assets/images/salmon.jpg'),
  "assets/images/beef_wellington.jpg": require('../assets/images/beef_wellington.jpg'),
};

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: 'all',
      menuItems: [],
    };
  }

  async componentDidMount() {
    try {
      const storedData = await AsyncStorage.getItem('menuItems');
      let items = [];
      if (storedData) {
        items = JSON.parse(storedData);
      } else {
        items = menuData;
      }
      // Map images for bundled assets only
      const itemsWithImages = items.map(item => ({
        ...item,
        image: item.image && imageMap[item.image] ? imageMap[item.image] : item.image,
      }));
      this.setState({ menuItems: itemsWithImages });
    } catch (error) {
      // fallback to bundled data if error
      const itemsWithImages = menuData.map(item => ({
        ...item,
        image: item.image && imageMap[item.image] ? imageMap[item.image] : item.image,
      }));
      this.setState({ menuItems: itemsWithImages });
    }
  }

  setType = (type) => {
    this.setState({ selectedType: type });
  };

  // NEW: add item to cart (stored under 'cart' key). Saves serializable fields only.
  handleAddToPayment = async (item) => {
    try {
      const cartJson = await AsyncStorage.getItem('cart');
      const cart = cartJson ? JSON.parse(cartJson) : [];

      // create a serializable version of the item (avoid module/require objects)
      let imagePath = null;
      if (typeof item.image === 'string') {
        imagePath = item.image;
      } else {
        // reverse-lookup bundled image key if possible
        const foundKey = Object.keys(imageMap).find(k => imageMap[k] === item.image);
        imagePath = foundKey || null;
      }

      const existing = cart.find(ci => ci.id === item.id);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
      } else {
        cart.push({
          id: item.id,
          name: item.name,
          price: item.price,
          image: imagePath, // string path or null
          quantity: 1,
        });
      }
      await AsyncStorage.setItem('cart', JSON.stringify(cart));

      // feedback and navigate to Payment tab
      Alert.alert('Added', `${item.name} added to payment`, [
        { text: 'View payment', onPress: () => this.props.navigation.navigate('Payment') },
        { text: 'Continue', style: 'cancel' },
      ]);
    } catch (e) {
      console.error('Error adding to cart', e);
    }
  };

  render() {
    const { selectedType, menuItems } = this.state;
    const filteredItems =
      selectedType === 'all'
        ? menuItems
        : menuItems.filter(item => item.type === selectedType);

    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
        <View style={{ alignItems: 'center' }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBar}
          >
            {FOOD_TYPES.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.filterButton,
                  selectedType === type.value && styles.filterButtonActive,
                ]}
                onPress={() => this.setType(type.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedType === type.value && styles.filterButtonTextActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <Text style={styles.counter}>
          {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'}
        </Text>
        <ScrollView contentContainerStyle={styles.container}>
          {filteredItems.map(item => (
            // Make the whole menu item clickable
            <TouchableOpacity
              key={item.id}
              onPress={() => this.handleAddToPayment(item)}
              activeOpacity={0.8}
            >
              <View style={styles.menuItem}>
                {item.image && typeof item.image !== 'string' ? (
                  <Image source={item.image} style={styles.image} />
                ) : item.image && typeof item.image === 'string' ? (
                  <Image source={{ uri: item.image }} style={styles.image} />
                ) : (
                  <View style={[styles.image, { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={{ color: '#aaa', fontSize: 10 }}>No Image</Text>
                  </View>
                )}
                <View style={styles.details}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                  <Text style={styles.price}>{item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#00000017',
  },
  filterButtonActive: {
    backgroundColor: '#000000ff',
    borderStyle: 'solid',
    borderWidth: 1,
    
  },
  filterButtonText: {
    color: '#000000ff',
    fontWeight: 'bold',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  container: {
    padding: 16,
    paddingBottom: 90,
    backgroundColor: '#fff',
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 120,
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#00000017',
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: "100%",
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  details: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000ff',
  },
  counter: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000000ff',
  },
});



// Photo by dam i: https://www.pexels.com/photo/delicious-grilled-salmon-with-vegetables-29748127/
// Photo by Nadin Sh: https://www.pexels.com/photo/meal-on-plate-20095442/
// Photo by Arti.tic: https://www.pexels.com/photo/close-up-of-creamy-risotto-with-fresh-herbs-34110276/
// Photo by khezez  | خزاز: https://www.pexels.com/photo/delicious-italian-pasta-dish-with-side-dishes-29935439/
// Photo by Rahib Yaqubov: https://www.pexels.com/photo/roasted-lamb-shanks-with-mashed-potatoes-16588046/
// Photo by Gabriel Lima: https://www.pexels.com/photo/caprese-salad-on-a-plate-15735983/
// Photo by Joost van Os: https://www.pexels.com/photo/paella-on-plates-13207675/
// Photo by Valeria Boltneva: https://www.pexels.com/photo/a-chocolate-dessert-with-ice-cream-and-strawberries-27819688/
// Photo by Askar Abayev: https://www.pexels.com/photo/bruschetta-on-brown-wooden-board-5638331/
// Photo by Sami  Abdullah: https://www.pexels.com/photo/saucepan-of-vegetable-and-octopus-soup-on-table-11689800/
// Photo by Lisa from Pexels: https://www.pexels.com/photo/vegetable-salad-on-white-ceramic-plate-beside-grey-stainless-steel-fork-1152237/
// Photo by Elle Hughes: https://www.pexels.com/photo/close-up-photo-of-pastry-1549188/
// Photo by Diana ✨: https://www.pexels.com/photo/grilled-tasty-stuffed-mushrooms-and-eggplant-on-grill-4294490/
// Photo by Valeria Boltneva: https://www.pexels.com/photo/meal-on-plate-9266842/
// Photo by julie aagaard: https://www.pexels.com/photo/salad-on-a-plate-2097090/