import { Text, StyleSheet, View, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput, Button, ScrollView } from 'react-native'
import React, { Component } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';

// map same as Menu to resolve bundled images
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

export default class Payment extends Component {
  state = {
    loading: true,
    cart: [],
    paymentModalVisible: false,
    receiptModalVisible: false,
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCVV: '',
    bankName: '',
    accountNumber: '',
    receiptText: '',
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.loadCart();
    });
    this.loadCart();
  }

  componentWillUnmount() {
    if (this._unsubscribe) this._unsubscribe();
  }

  loadCart = async () => {
    try {
      const json = await AsyncStorage.getItem('cart');
      const cart = json ? JSON.parse(json) : [];
      this.setState({ cart, loading: false });
    } catch (e) {
      console.error('Error loading cart', e);
      this.setState({ cart: [], loading: false });
    }
  }

  clearCart = async () => {
    Alert.alert('Clear cart', 'Remove all items from payment?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: async () => {
        await AsyncStorage.removeItem('cart');
        this.setState({ cart: [] });
      } }
    ]);
  }

  openPaymentModal = () => {
    this.setState({ paymentModalVisible: true });
  }

  closePaymentModal = () => {
    this.setState({ 
      paymentModalVisible: false,
      cardNumber: '',
      cardName: '',
      cardExpiry: '',
      cardCVV: '',
      bankName: '',
      accountNumber: '',
    });
  }

  processPayment = () => {
    const { paymentMethod, cardNumber, cardName, cardExpiry, cardCVV, bankName, accountNumber, cart } = this.state;
    
    // Validation
    if (paymentMethod === 'credit_card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVV) {
        Alert.alert('Error', 'Please fill in all card details');
        return;
      }
    } else if (paymentMethod === 'bank_transfer') {
      if (!bankName || !accountNumber) {
        Alert.alert('Error', 'Please fill in all bank details');
        return;
      }
    }

    const total = cart.reduce((sum, it) => {
      const num = Number(String(it.price).replace(/[^0-9.-]+/g,'')) || 0;
      return sum + num * (it.quantity || 1);
    }, 0);

    // Generate receipt (string)
    const receipt = this.generateReceipt(total, paymentMethod);

    this.closePaymentModal();

    // show styled modal instead of Alert
    this.setState({ receiptText: receipt, receiptModalVisible: true });
  }

  // improved receipt with order id, address, and tax calculation
  generateReceipt = (total, paymentMethod) => {
    const { cart } = this.state;
    const date = new Date();
    const orderId = 'ORD' + date.getTime();

    const TAX_RATE = 0.15; // 15% tax
    const tax = total * TAX_RATE;
    const grandTotal = total + tax;

    let lines = [];
    lines.push("CHRISTOFFEL'S KITCHEN");
    lines.push("Order: " + orderId);
    lines.push("Date: " + date.toLocaleString());
    lines.push('-----------------------------------');
    lines.push('Items:');
    cart.forEach(item => {
      const priceNum = Number(String(item.price).replace(/[^0-9.-]+/g,'')) || 0;
      const itemTotal = priceNum * (item.quantity || 1);
      lines.push(`${item.name}  x${item.quantity || 1}  R${itemTotal.toFixed(2)}`);
    });
    lines.push('-----------------------------------');
    lines.push(`Subtotal: R${total.toFixed(2)}`);
    lines.push(`Tax (${(TAX_RATE*100).toFixed(0)}%): R${tax.toFixed(2)}`);
    lines.push(`TOTAL: R${grandTotal.toFixed(2)}`);
    lines.push('Payment: ' + (paymentMethod === 'credit_card' ? 'Credit Card' : 'Bank Transfer'));
    // mask card / account
    if (paymentMethod === 'credit_card') {
      const n = this.state.cardNumber || '';
      lines.push(`Card: ****${n.slice(-4)}`);
    } else {
      const a = this.state.accountNumber || '';
      lines.push(`Account: ****${a.slice(-4)}`);
    }
    lines.push('');
    lines.push('Thank you for your order!');
    lines.push('Address: 123 Cnr And Left St, City');
    lines.push('Phone: 012 345 6789');

    // join with newlines
    return lines.join('\n');
  }

  closeReceiptModal = async () => {
    // clear cart and close modal
    await AsyncStorage.removeItem('cart');
    this.setState({ cart: [], receiptModalVisible: false, receiptText: '' });
  }

  renderItem = ({ item }) => {
    const imgSource = item.image && imageMap[item.image]
      ? imageMap[item.image]
      : (item.image ? { uri: item.image } : null);

    return (
      <View style={styles.row}>
        {imgSource ? <Image source={imgSource} style={styles.img} /> : <View style={[styles.img, {backgroundColor:'#eee'}]} />}
        <View style={{flex:1, paddingLeft:12}}>
          <Text style={{fontWeight:'bold'}}>{item.name}</Text>
          <Text>{item.quantity} x {item.price}</Text>
        </View>
        <Text style={{fontWeight:'bold'}}>{item.price}</Text>
      </View>
    );
  }

  render() {
    const { loading, cart, paymentModalVisible, receiptModalVisible, paymentMethod } = this.state;
    const total = cart.reduce((sum, it) => {
      const num = Number(String(it.price).replace(/[^0-9.-]+/g,'')) || 0;
      return sum + num * (it.quantity || 1);
    }, 0);

    if (loading) return <View style={styles.container}><ActivityIndicator /></View>;

    return (
      <View style={styles.container}>
        {cart.length === 0 ? (
          <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
            <Text style={{fontSize:18}}>Cart is empty</Text>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={i => String(i.id)}
            renderItem={this.renderItem}
            contentContainerStyle={{padding:16}}
          />
        )}

        {cart.length > 0 && (
          <View style={styles.footer}>
            <Text style={{fontWeight:'bold', fontSize:16}}>Total: R{total.toFixed(2)}</Text>
            <View style={{flexDirection:'row', gap:12}}>
              <TouchableOpacity style={styles.button} onPress={this.clearCart}>
                <Text style={{color:'#fff'}}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, {backgroundColor:'#2e7d32'}]} onPress={this.openPaymentModal}>
                <Text style={{color:'#fff'}}>Checkout</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Payment Modal */}
        <Modal
          visible={paymentModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={this.closePaymentModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Payment Details</Text>

              {/* Payment Method Selection */}
              <View style={styles.methodRow}>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'credit_card' && styles.methodButtonActive
                  ]}
                  onPress={() => this.setState({ paymentMethod: 'credit_card' })}
                >
                  <Text style={[
                    styles.methodText,
                    paymentMethod === 'credit_card' && styles.methodTextActive
                  ]}>Credit Card</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.methodButton,
                    paymentMethod === 'bank_transfer' && styles.methodButtonActive
                  ]}
                  onPress={() => this.setState({ paymentMethod: 'bank_transfer' })}
                >
                  <Text style={[
                    styles.methodText,
                    paymentMethod === 'bank_transfer' && styles.methodTextActive
                  ]}>Bank Transfer</Text>
                </TouchableOpacity>
              </View>

              {/* Credit Card Form */}
              {paymentMethod === 'credit_card' && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Cardholder Name"
                    value={this.state.cardName}
                    onChangeText={text => this.setState({ cardName: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Card Number (16 digits)"
                    value={this.state.cardNumber}
                    onChangeText={text => this.setState({ cardNumber: text })}
                    keyboardType="numeric"
                    maxLength={16}
                  />
                  <View style={{flexDirection:'row', gap:12}}>
                    <TextInput
                      style={[styles.input, {flex:1}]}
                      placeholder="MM/YY"
                      value={this.state.cardExpiry}
                      onChangeText={text => this.setState({ cardExpiry: text })}
                      maxLength={5}
                    />
                    <TextInput
                      style={[styles.input, {flex:1}]}
                      placeholder="CVV"
                      value={this.state.cardCVV}
                      onChangeText={text => this.setState({ cardCVV: text })}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                </>
              )}

              {/* Bank Transfer Form */}
              {paymentMethod === 'bank_transfer' && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Bank Name"
                    value={this.state.bankName}
                    onChangeText={text => this.setState({ bankName: text })}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Account Number"
                    value={this.state.accountNumber}
                    onChangeText={text => this.setState({ accountNumber: text })}
                    keyboardType="numeric"
                  />
                </>
              )}

              <View style={{flexDirection:'row', gap:12, marginTop:16}}>
                <Button title="Cancel" color="#888" onPress={this.closePaymentModal} />
                <Button title={"Pay R" + total.toFixed(2)} color="#2e7d32" onPress={this.processPayment} />
              </View>
            </View>
          </View>
        </Modal>

        {/* Receipt Modal */}
        <Modal
          visible={receiptModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={this.closeReceiptModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { padding: 0, overflow: 'hidden', position: 'relative' }]}>
              {/* Background Image */}
              <Image
                source={require('../assets/images/reciept-paper.jpeg')}
                style={styles.receiptBackground}
              />
              
              {/* Content on top of background */}
              <View style={{ padding: 16, position: 'relative', zIndex: 1 }}>
                <ScrollView style={{ maxHeight: '80%' }}>
                  <Text style={{ fontFamily: 'monospace', color:'#111', fontSize: 12 }}>
                    {this.state.receiptText}
                  </Text>
                </ScrollView>
                <View style={{ marginTop: 12, flexDirection:'row', justifyContent:'space-between' }}>
                  <Button title="Close" onPress={this.closeReceiptModal} />
                </View>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  row: {
    flexDirection:'row',
    alignItems:'center',
    marginBottom:12,
    backgroundColor:'#f7f7f7',
    padding:12,
    borderRadius:8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 2,
  },
  img: {
    width:64,
    height:64,
    borderRadius:8,
    backgroundColor:'#ddd',
  },
  footer: {
    padding:16,
    borderTopWidth:1,
    borderColor:'#eee',
    backgroundColor:'#fff',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingBottom:100,
  },
  button: {
    paddingHorizontal:12,
    paddingVertical:8,
    backgroundColor:'#d32f2f',
    borderRadius:8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  methodRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  methodButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  methodButtonActive: {
    backgroundColor: '#2e7d32',
  },
  methodText: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
  methodTextActive: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
  },
  receiptBackground: {
    width: '100%',
    height: '110%',
    resizeMode: 'cover',
    position: 'absolute',
  },
});