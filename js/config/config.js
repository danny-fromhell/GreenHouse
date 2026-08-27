export const APP_CONFIG = {
  appName: "Green House",

  // API de Perenual
  perenualApi: {
    baseUrl: "https://perenual.com/api/v2",
    apiKey: ""
  },

  // Archivos JSON locales
  localData: {
    users: "data/users.json",
    dashboardStats: "data/dashboard-stats.json"
  },

  // Claves para localStorage
  storageKeys: {
    cacheKey: "greenhouse_plants_cache",
    themeKey: "greenhouse_theme",
    authKey: "greenhouse_current_user"
  },

  // Duración de caché: 1 hora
  cacheDuration: 1000 * 60 * 60,

  // Rutas de la aplicación
  routes: {
    login: "login.html",
    dashboard: "dashboard.html",
    plants: "plants.html",
    home: "index.html"
  }
};
