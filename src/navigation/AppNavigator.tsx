import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import CartScreen from "../screens/CartScreen";
import { Product } from "../../types";
import { CartProvider } from "../context/CartContext";

export type RootStackParamList = {
    Home: undefined;
    Carrinho: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <CartProvider>
            <NavigationContainer>
                <Stack.Navigator
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#007bff',
                        },
                        headerTintColor: '#fff',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                    }}
                >
                    <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Produtos' }} />
                    <Stack.Screen name="Carrinho" component={CartScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </CartProvider>
    );
};

export default AppNavigator;