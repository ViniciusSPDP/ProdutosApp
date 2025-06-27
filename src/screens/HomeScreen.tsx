// src/screens/HomeScreen.tsx

import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TextInput,
    Alert,
    TouchableOpacity,
    Button,
    Modal,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { Product } from "../../types";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

const HomeScreen: React.FC = () => {
    // Estados principais
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);

    // --- NOVO: Estados para a funcionalidade de pesquisa ---
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Estados para o formulário no Modal
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");
    const [newProductDescription, setNewProductDescription] = useState(""); // NOVO: Estado para a descrição
    const [newProductCategory, setNewProductCategory] = useState(""); // 1. Adicionar estado para a categoria


    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { addToCart, cartItemCount } = useCart();

    const API_URL = "https://682e5317746f8ca4a47c9c37.mockapi.io/api/Product";

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setProducts(response.data);
            setFilteredProducts(response.data); // Inicializa a lista filtrada
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            Alert.alert("Erro", "Não foi possível carregar os produtos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // --- NOVO: Efeito para aplicar o filtro de pesquisa ---
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredProducts(products);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(lowercasedQuery)
            );
            setFilteredProducts(filtered);
        }
    }, [searchQuery, products]);

    const handleAddProduct = async () => {
        // ... (lógica de adicionar produto mantida)
        if (!newProductName.trim() || !newProductCategory.trim() || !newProductPrice.trim() || !newProductDescription.trim()) { // Adicionada validação para description
            Alert.alert("Atenção", "Por favor, preencha todos os campos!");
            return;
        }
        // Validação de preço
        const priceNumber = parseFloat(newProductPrice.replace(',', '.'));
        if (isNaN(priceNumber) || priceNumber <= 0) {
            Alert.alert("Erro", "Por favor, insira um preço válido.");
            return;
        }
        try {
            const newProduct = { // Incluindo description no objeto do novo produto
                name: newProductName,
                price: priceNumber.toString(),
                description: newProductDescription,
                category: newProductCategory
            };
            await axios.post(API_URL, newProduct);
            setNewProductName("");
            setNewProductPrice("");
            setNewProductDescription(""); // Limpa o campo de descrição após adicionar
            setNewProductCategory(""); // Limpar o estado da categoria
            setModalVisible(false);
            fetchProducts();
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            Alert.alert("Erro", "Ocorreu um erro ao cadastrar o produto.");
        }
    };

    // --- UI APRIMORADA: Card de produto com visual mais limpo ---
    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            style={styles.productCard}
            activeOpacity={0.7} // Efeito visual ao clicar
        >
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                <Ionicons name="add" size={24} color="#007bff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.centered} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* --- UI APRIMORADA: Cabeçalho com título, pesquisa e carrinho --- */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Produtos</Text>
                <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate("Carrinho")}>
                    <Ionicons name="cart-outline" size={28} color="#333" />
                    {cartItemCount > 0 && (
                        <View style={styles.cartBadge}>
                            <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* --- NOVO: Barra de Pesquisa --- */}
            <View style={styles.searchSection}>
                <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Pesquisar por nome..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#888"
                />
            </View>

            <FlatList
                data={filteredProducts} // Usa a lista filtrada
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
            />

            {/* Botão Flutuante para adicionar produto (FAB) */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>

            {/* Modal para Adicionar Produto */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Cadastrar Novo Produto</Text>
                        <TextInput
                            placeholder="Nome do produto"
                            value={newProductName}
                            onChangeText={setNewProductName}
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Preço (ex: 29.99)"
                            value={newProductPrice}
                            onChangeText={setNewProductPrice}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <TextInput
                            placeholder="Categoria do produto"
                            value={newProductCategory}
                            onChangeText={setNewProductCategory}
                            style={styles.input}
                        />
                        <TextInput // NOVO: Campo para a descrição do produto
                            placeholder="Descrição do produto"
                            value={newProductDescription}
                            onChangeText={setNewProductDescription}
                            multiline
                            numberOfLines={4}
                            style={[styles.input, styles.descriptionInput]}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.submitButton]} onPress={handleAddProduct}>
                                <Text style={styles.modalButtonText}>Cadastrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// --- ESTILOS APRIMORADOS ---
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f2f5' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        backgroundColor: '#f0f2f5',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1c1c1e',
    },
    cartIcon: {
        padding: 5,
    },
    cartBadge: {
        position: 'absolute',
        right: -6,
        top: -3,
        backgroundColor: '#007bff',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: 5,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
    },
    listContainer: { paddingHorizontal: 20, paddingBottom: 80 },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    productInfo: { flex: 1, marginRight: 10 },
    productName: { fontSize: 18, fontWeight: '600', color: '#333' },
    productPrice: { fontSize: 16, color: '#007bff', marginTop: 5, fontWeight: 'bold' },
    addToCartButton: {
        backgroundColor: '#eaf4ff',
        padding: 12,
        borderRadius: 50,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#007bff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 25,
        alignItems: 'stretch',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    input: {
        height: 50,
        backgroundColor: '#f0f2f5',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    descriptionInput: { // NOVO: Estilo para o campo de descrição
        height: 100, // Altura maior para a descrição
        textAlignVertical: 'top', // Alinha o texto no topo em Android
        paddingTop: 15, // Espaçamento interno superior para o texto
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f8f8f8',
        marginRight: 10,
    },
    submitButton: {
        backgroundColor: '#007bff',
    },
    modalButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    }
});

export default HomeScreen;