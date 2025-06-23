import React from "react";
import { View, Text, FlatList, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { useCart } from "../context/CartContext";
import { Ionicons } from "@expo/vector-icons";
import { Product } from "../../types";

const CartScreen: React.FC = () => {
    const { cart } = useCart();
    
    // Cálculo seguro do total
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price);
        return sum + (isNaN(price) ? 0 : price);
    }, 0);

    const renderCartItem = ({ item }: { item: Product }) => (
        <View style={styles.itemContainer}>
            <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
            </View>
            <Ionicons name="pricetag-outline" size={24} color="#007bff" />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={cart}
                renderItem={renderCartItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                contentContainerStyle={styles.list}
                ListHeaderComponent={<Text style={styles.title}>Meu Carrinho</Text>}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="cart-outline" size={80} color="#ccc" />
                        <Text style={styles.emptyText}>Seu carrinho está vazio!</Text>
                    </View>
                }
            />
            {cart.length > 0 && (
                <View style={styles.footer}>
                    <Text style={styles.total}>Total: R$ {total.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.checkoutButton}>
                        <Text style={styles.checkoutButtonText}>Finalizar Compra</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    list: { padding: 20 },
    title: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 20, 
        color: '#333',
        textAlign: 'center'
    },
    itemContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
    },
    itemName: { fontSize: 18, color: '#555' },
    itemPrice: { fontSize: 16, color: '#888', marginTop: 4 },
    footer: {
        padding: 20,
        borderTopWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#fff',
    },
    total: { 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#333',
        textAlign: 'right',
        marginBottom: 15,
    },
    checkoutButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 18,
        color: '#aaa',
        marginTop: 20,
    },
});

export default CartScreen;