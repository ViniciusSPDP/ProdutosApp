module.exports = {
  expo: {
    name: "ProdutosApp",
    slug: "ProdutosApp",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      package: "com.escola.produtosapp",
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      useNextNotificationsApi: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#ffffff"
        }
      ]
    ],
    extra: {
      eas: {
        projectId: "19d3d5bd-ef5b-4446-83b8-465a4f2fcfa3"
      }
    },
    owner: "s4r41va"
  }
};