import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'

export default class Payment extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Reserved for the final poe</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 18,
    textAlign: 'center'
  }
})