import { Text, StyleSheet, View } from 'react-native'
import React, { Component } from 'react'
import { Button } from 'react-native'

export default class Navbar extends Component {
  render() {
    return (
      <View>
        <Button title="Home" onPress={() => this.props.navigation.navigate('Home')} />
        <Button title="Menu" onPress={() => this.props.navigation.navigate('Menu')} />
        <Button title="Management" onPress={() => this.props.navigation.navigate('Management')} />
        <Button title="Payment" onPress={() => this.props.navigation.navigate('Payment')} />
      </View>
    )
  }
}

const styles = StyleSheet.create({})