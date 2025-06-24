// src/screens/CheckoutScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type CheckoutNavigationProp = StackNavigationProp<RootStackParamList, 'Checkout'>;

const CheckoutScreen: React.FC = () => {
  const navigation = useNavigation<CheckoutNavigationProp>();
  const { cart, total, clearCart } = useCart();

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');

  const handlePlaceOrder = () => {
    // Validação simples dos campos
    if (!name.trim() || !address.trim() || !city.trim() || !zipCode.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos de entrega.');
      return;
    }

    // Em um app real, aqui você enviaria os dados para um backend
    console.log('--- Pedido Finalizado ---');
    console.log('Cliente:', name);
    console.log('Endereço:', `${address}, ${city} - ${zipCode}`);
    console.log('Forma de Pagamento:', paymentMethod);
    console.log('Itens:', JSON.stringify(cart, null, 2));
    console.log('Total:', total.toFixed(2));
    console.log('-------------------------');

    // Limpa o carrinho e navega para a tela de confirmação
    clearCart();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }, { name: 'OrderConfirmation' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Finalizar Compra</Text>

        {/* Seção de Entrega */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome Completo"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Endereço (Rua e Número)"
            value={address}
            onChangeText={setAddress}
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={styles.input}
            placeholder="CEP"
            value={zipCode}
            onChangeText={setZipCode}
            keyboardType="numeric"
          />
        </View>

        {/* Seção de Pagamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Forma de Pagamento</Text>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'credit_card' && styles.selectedOption]}
            onPress={() => setPaymentMethod('credit_card')}
          >
            <Ionicons name="card-outline" size={24} color={paymentMethod === 'credit_card' ? '#007bff' : '#555'} />
            <Text style={[styles.paymentText, paymentMethod === 'credit_card' && styles.selectedText]}>Cartão de Crédito</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.paymentOption, paymentMethod === 'pix' && styles.selectedOption]}
            onPress={() => setPaymentMethod('pix')}
          >
            <Ionicons name="logo-bitcoin" size={24} color={paymentMethod === 'pix' ? '#007bff' : '#555'} />
            <Text style={[styles.paymentText, paymentMethod === 'pix' && styles.selectedText]}>Pix</Text>
          </TouchableOpacity>
        </View>

        {/* Resumo e Botão Finalizar */}
        <View style={styles.summaryContainer}>
          <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total do Pedido:</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
              <Text style={styles.placeOrderButtonText}>Finalizar Pedido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    scrollContainer: { padding: 20 },
    title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    section: { marginBottom: 25 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#555' },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        fontSize: 16,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10,
    },
    selectedOption: { borderColor: '#007bff', backgroundColor: '#eaf4ff' },
    paymentText: { fontSize: 16, marginLeft: 10, color: '#555' },
    selectedText: { color: '#007bff', fontWeight: 'bold' },
    summaryContainer: { marginTop: 20 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    totalText: { fontSize: 18, color: '#333' },
    totalValue: { fontSize: 22, fontWeight: 'bold', color: '#007bff' },
    placeOrderButton: {
        backgroundColor: '#28a745',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    placeOrderButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

export default CheckoutScreen;