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
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    
    // Estados para o formulário no Modal
    const [newProductName, setNewProductName] = useState("");
    const [newProductPrice, setNewProductPrice] = useState("");

    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { addToCart, cartItemCount } = useCart();

    const API_URL = "https://682e5317746f8ca4a47c9c37.mockapi.io/api/Product";

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setProducts(response.data);
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

    const handleAddProduct = async () => {
        if (!newProductName.trim() || !newProductPrice.trim()) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos!");
            return;
        }
        try {
            const newProduct = {
                name: newProductName,
                price: newProductPrice,
            };
            await axios.post(API_URL, newProduct);
            setNewProductName("");
            setNewProductPrice("");
            setModalVisible(false);
            fetchProducts(); // Re-fetch para mostrar o novo produto
        } catch (error) {
            console.error("Erro ao cadastrar produto:", error);
            Alert.alert("Erro", "Ocorreu um erro ao cadastrar o produto.");
        }
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <View style={styles.productCard}>
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>R$ {parseFloat(item.price).toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
                <Ionicons name="cart-outline" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#007bff" style={styles.centered} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={<Text style={styles.emptyText}>Nenhum produto encontrado.</Text>}
            />

            {/* Botão Flutuante para adicionar produto */}
            <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
            
            {/* Ícone do Carrinho com contador */}
            <TouchableOpacity style={styles.cartIcon} onPress={() => navigation.navigate("Carrinho")}>
                <Ionicons name="cart" size={30} color="white" />
                {cartItemCount > 0 && (
                    <View style={styles.cartBadge}>
                        <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
                    </View>
                )}
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
                            placeholder="Preço"
                            value={newProductPrice}
                            onChangeText={setNewProductPrice}
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#dc3545" />
                            <Button title="Cadastrar" onPress={handleAddProduct} />
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 20 },
    productCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    productInfo: { flex: 1 },
    productName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    productPrice: { fontSize: 16, color: '#007bff', marginTop: 5 },
    addToCartButton: {
        backgroundColor: '#28a745',
        padding: 10,
        borderRadius: 50,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 100,
        backgroundColor: '#007bff',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    cartIcon: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#28a745',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    cartBadge: {
        position: 'absolute',
        right: -5,
        top: -5,
        backgroundColor: '#dc3545',
        borderRadius: 15,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: { color: 'white', fontSize: 12, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#6c757d' },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalView: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
});

export default HomeScreen;