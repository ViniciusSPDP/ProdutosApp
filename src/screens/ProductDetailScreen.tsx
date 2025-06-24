// src/screens/ProductDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/AppNavigator';
import { Product } from '../../types';
import { useCart } from '../context/CartContext';

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

const API_URL = 'https://682e5317746f8ca4a47c9c37.mockapi.io/api/Product';

const ProductDetailScreen: React.FC = () => {
    const route = useRoute<ProductDetailScreenRouteProp>();
    const { productId } = route.params;
    const { addToCart } = useCart();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            if (!productId) return;
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/${productId}`);
                setProduct(response.data);
            } catch (err) {
                console.error("Erro ao buscar detalhes do produto:", err);
                setError('Não foi possível carregar os detalhes do produto.');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.centered} />;
    }

    if (error || !product) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{error || 'Produto não encontrado.'}</Text>
            </View>
        );
    }
    
    // Como a API não fornece uma descrição, vamos criar uma de exemplo.
    const productDescription = `Descubra a qualidade e o design incrível do ${product.name}. Perfeito para o seu dia a dia, combinando estilo e funcionalidade. Feito com materiais de alta durabilidade, este produto é um investimento que vale a pena.`;

    return (
        <ScrollView style={styles.container}>
            {/* Usamos uma imagem de placeholder, já que a API não fornece uma URL */}
            <Image 
                source={{ uri: `https://via.placeholder.com/400x300.png/007bff/FFFFFF?text=${product.name.replace(/\s/g, '+')}` }} 
                style={styles.productImage} 
            />
            <View style={styles.detailsContainer}>
                <Text style={styles.productName}>{product.name}</Text>
                
                <Text style={styles.productPrice}>R$ {parseFloat(product.price).toFixed(2)}</Text>

                <View style={styles.descriptionSection}>
                    <Text style={styles.sectionTitle}>Descrição</Text>
                    <Text style={styles.productDescription}>{productDescription}</Text>
                </View>

                <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(product)}>
                    <Ionicons name="cart-outline" size={22} color="#fff" />
                    <Text style={styles.addToCartButtonText}>Adicionar ao Carrinho</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 16,
    },
    productImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    detailsContainer: {
        padding: 20,
    },
    productName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1c1c1e',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 24,
        fontWeight: '700',
        color: '#007bff',
        marginBottom: 20,
    },
    descriptionSection: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    productDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: '#6c757d',
    },
    addToCartButton: {
        backgroundColor: '#007bff',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        elevation: 3,
    },
    addToCartButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

export default ProductDetailScreen;