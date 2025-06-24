// src/screens/CartScreen.tsx

import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useCart } from '../context/CartContext';
import { Ionicons } from '@expo/vector-icons';
import { CartItem } from '../../types'; // Agora esta importação funcionará!
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

const CartScreen = () => {
    const { cart, total, increaseQuantity, decreaseQuantity, removeProductFromCart } = useCart();
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const renderCartItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItemContainer}>
            {/* Informações do produto */}
            <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
            </View>

            {/* Controles do item */}
            <View style={styles.itemControls}>
                <View style={styles.quantityControls}>
                    <TouchableOpacity onPress={() => decreaseQuantity(item.id)} style={styles.controlButton}>
                        <Ionicons name="remove-circle-outline" size={28} color="#555" />
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => increaseQuantity(item.id)} style={styles.controlButton}>
                        <Ionicons name="add-circle-outline" size={28} color="#007bff" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => removeProductFromCart(item.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={24} color="#dc3545" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={80} color="#ccc" />
                    <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
                    <Text style={styles.emptySubText}>Adicione produtos para vê-los aqui.</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        renderItem={renderCartItem}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.listContainer}
                    />
                    {/* O sumário e o botão de finalizar compra ficam aqui fora da lista */}
                    <View style={styles.summaryContainer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalText}>Total</Text>
                            <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity 
                            style={styles.checkoutButton} 
                            onPress={() => navigation.navigate('Checkout')}
                        >
                            <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

// Seus estilos (styles) continuam os mesmos
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    listContainer: {
        padding: 16,
    },
    cartItemContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
    },
    itemInfo: {
        marginBottom: 10,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 16,
        color: '#888',
        marginTop: 4,
    },
    itemControls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    controlButton: {
        padding: 5,
    },
    quantityText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 15,
        minWidth: 30,
        textAlign: 'center',
    },
    deleteButton: {
        padding: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555',
    },
    emptySubText: {
        marginTop: 8,
        fontSize: 16,
        color: '#aaa',
    },
    summaryContainer: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        padding: 20,
        backgroundColor: '#fff',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    totalText: {
        fontSize: 18,
        color: '#555',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    checkoutButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});


export default CartScreen;