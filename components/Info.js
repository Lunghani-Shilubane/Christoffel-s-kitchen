import { Text, StyleSheet, View, ImageBackground } from 'react-native';
import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/images/chef.jpg')}
          style={styles.heroImage}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.overlay}>
            <Text style={styles.welcome}>Welcome to Christoffel's Kitchen!</Text>
            <Text style={styles.about}>
              Private Chef Christoffel is a passionate and culinary artist with over 20 years of experience in fine dining and catering. 
              His business is built on a foundation of quality, creativity, and personal touch, serving the community with unique flavors and memorable experiences. 
              Expertise in French and Mediterranean cuisine, Chef Christoffel brings a blend of tradition and innovation to every dish.
            </Text>
            <View style={styles.availabilityContainer}>
              <Text style={styles.availabilityTitle}>Availability:</Text>
              <Text style={styles.availabilityText}>Monday - Friday: 9:00 AM – 8:00 PM</Text>
              <Text style={styles.availabilityText}>Saturday: 10:00 AM – 6:00 PM</Text>
              <Text style={styles.availabilityText}>Sunday: Closed{'\n'}{'\n'}</Text>
              <Text style={styles.availabilityText}>Contact: 015 238 9242</Text>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  about: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 18,
  },
  availabilityContainer: {
    marginTop: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  availabilityTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  availabilityText: {
    color: '#fff',
    fontSize: 14,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});





//Photo by Fidel Hajj: https://www.pexels.com/photo/standing-person-using-fork-and-knife-on-preparing-food-2814828/