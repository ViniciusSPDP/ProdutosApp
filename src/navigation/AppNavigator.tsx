// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmationScreen';

// 2. Adicionar a rota 'ProductDetail' à nossa lista de tipos
export type RootStackParamList = {
    Home: undefined;
    Carrinho: undefined;
    ProductDetail: { productId: string }; // Receberá o ID do produto
    Checkout: undefined;
    OrderConfirmation: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#f0f2f5',
                        elevation: 0, // remove sombra no Android
                        shadowOpacity: 0, // remove sombra no iOS
                    },
                    headerTintColor: '#1c1c1e',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerBackTitle: '', // Esconde o texto de "voltar" no iOS (string vazia)
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }} // Esconde o cabeçalho padrão na Home, pois já criamos um customizado
                />
                <Stack.Screen
                    name="Carrinho"
                    component={CartScreen}
                    options={{ title: 'Meu Carrinho' }}
                />
                {/* 3. Adicionar a tela à pilha de navegação */}
                <Stack.Screen
                    name="ProductDetail"
                    component={ProductDetailScreen}
                    options={{ title: 'Detalhes do Produto' }} // Título que aparecerá no cabeçalho
                />
                <Stack.Screen
                    name="Checkout"
                    component={CheckoutScreen}
                    options={{ title: 'Checkout' }}
                />
                <Stack.Screen
                    name="OrderConfirmation"
                    component={OrderConfirmationScreen}
                    options={{ headerShown: false }} // Tela cheia, sem cabeçalho
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;