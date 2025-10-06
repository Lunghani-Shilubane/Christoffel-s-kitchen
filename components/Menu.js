import { Text, StyleSheet, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { Component } from 'react';

const FOOD_TYPES = [
  { label: 'All', value: 'all' },
  { label: 'Mains', value: 'mains' },
  { label: 'Starters', value: 'starters' },
  { label: 'Desserts', value: 'desserts' },
  { label: 'Salads', value: 'salads' },
];

export default class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: 'all',
      menuItems: [
        {
          id: 1,
          name: 'Grilled Salmon',
          description: 'Fresh salmon fillet grilled to perfection, served with lemon butter sauce.',
          price: 'R180',
          type: 'mains',
          image: require('../assets/images/salmon.jpg'),
        },
        {
          id: 2,
          name: 'Beef Wellington',
          description: 'Tender beef wrapped in puff pastry with mushroom duxelles and prosciutto.',
          price: 'R250',
          type: 'mains',
          image: require('../assets/images/beef_wellington.jpg'),
        },
        {
          id: 3,
          name: 'Vegetarian Risotto',
          description: 'Creamy risotto with seasonal vegetables and parmesan cheese.',
          price: 'R120',
          type: 'mains',
          image: require('../assets/images/risotto.jpg'),
        },
        {
          id: 4,
          name: 'Chicken Alfredo',
          description: 'Pasta tossed in a creamy Alfredo sauce with grilled chicken and parmesan.',
          price: 'R140',
          type: 'mains',
          image: require('../assets/images/chicken_alfredo.jpg'),
        },
        {
          id: 5,
          name: 'Lamb Shank',
          description: 'Slow-cooked lamb shank in a red wine and rosemary sauce, served with mashed potatoes.',
          price: 'R220',
          type: 'mains',
          image: require('../assets/images/lamb_shank.jpg'),
        },
        {
          id: 6,
          name: 'Caprese Salad',
          description: 'Fresh mozzarella, tomatoes, and basil drizzled with balsamic glaze.',
          price: 'R90',
          type: 'salads',
          image: require('../assets/images/caprese_salad.jpg'),
        },
        {
          id: 7,
          name: 'Seafood Paella',
          description: 'Traditional Spanish rice dish with prawns, mussels, calamari, and saffron.',
          price: 'R200',
          type: 'mains',
          image: require('../assets/images/seafood_paella.jpg'),
        },
        {
          id: 8,
          name: 'Chocolate Lava Cake',
          description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.',
          price: 'R80',
          type: 'desserts',
          image: require('../assets/images/lava_cake.jpg'),
        },
        {
          id: 9,
          name: 'Bruschetta',
          description: 'Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil.',
          price: 'R60',
          type: 'starters',
          image: require('../assets/images/bruschetta.jpg'),
        },
        {
          id: 10,
          name: 'French Onion Soup',
          description: 'Classic soup with caramelized onions, beef broth, and melted cheese.',
          price: 'R75',
          type: 'starters',
          image: require('../assets/images/french_onion_soup.jpg'),
        },
        {
          id: 11,
          name: 'Greek Salad',
          description: 'Crisp lettuce, tomatoes, cucumber, olives, feta cheese, and oregano.',
          price: 'R85',
          type: 'salads',
          image: require('../assets/images/greek_salad.jpg'),
        },
        {
          id: 12,
          name: 'Tiramisu',
          description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
          price: 'R90',
          type: 'desserts',
          image: require('../assets/images/tiramisu.jpg'),
        },
        {
          id: 13,
          name: 'Stuffed Mushrooms',
          description: 'Mushrooms stuffed with cheese, herbs, and breadcrumbs.',
          price: 'R70',
          type: 'starters',
          image: require('../assets/images/stuffed_mushrooms.jpg'),
        },
        {
          id: 14,
          name: 'Duck Confit',
          description: 'Slow-cooked duck leg served with crispy potatoes and red wine sauce.',
          price: 'R230',
          type: 'mains',
          image: require('../assets/images/duck_confit.jpg'),
        },
        {
          id: 15,
          name: 'Caesar Salad',
          description: 'Romaine lettuce, parmesan, croutons, and Caesar dressing.',
          price: 'R80',
          type: 'salads',
          image: require('../assets/images/caesar_salad.jpg'),
        },
      ],
    };
  }

  setType = (type) => {
    this.setState({ selectedType: type });
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
        <ScrollView contentContainerStyle={styles.container}>
          {filteredItems.map(item => (
            <View key={item.id} style={styles.menuItem}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.description}>{item.description}</Text>
                <Text style={styles.price}>{item.price}</Text>
              </View>
            </View>
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
    marginTop: 32, // <-- Add this line to move filters lower
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#2e7d32',
  },
  filterButtonText: {
    color: '#333',
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
  },
  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    borderRadius: 12,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },
  image: {
    width: 90,
    height: 90,
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
    color: '#2e7d32',
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