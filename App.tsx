import React, { useEffect, useState, useRef } from 'react';
import { Platform, Alert } from 'react-native';
import { CartProvider } from './src/context/CartContext';
import AppNavigator from './src/navigation/AppNavigator';

// --- Imports para Notificações ---
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// --- CORREÇÃO: Handler de Notificações ---
// Usando as propriedades atualizadas conforme a nova API
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,   // Substitui shouldShowAlert (depreciado)
    shouldShowList: true,     // Nova propriedade obrigatória
    shouldPlaySound: true,   
    shouldSetBadge: true,     
  }),
});

// --- Função para registrar o dispositivo ---
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Falha!', 'Não foi possível obter o token para notificações push!');
      return;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Seu token de notificação é:", token);
    } catch (e) {
      console.error("Erro ao obter o token de notificação:", e);
      Alert.alert('Erro', 'Ocorreu um erro ao obter o token de notificação. Verifique sua conexão e configuração do projeto.');
    }

  } else {
    Alert.alert('Atenção', 'Notificações Push só funcionam em dispositivos físicos.');
  }

  return token;
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token || ''));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Usuário interagiu com a notificação:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}