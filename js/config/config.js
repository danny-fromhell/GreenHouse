export const APP_CONFIG = {
  appName: "Green House",

  // API de Perenual (mantenemos tu key original)
  perenualApi: {
    baseUrl: "https://perenual.com/api/v2",
    apiKey: "sk-5Igw6a19cdfe9db9917626"
  },

  // Archivos JSON locales (nueva simulación de base de datos)
  localData: {
    users: "data/users.json",
    dashboardStats: "data/dashboard-stats.json"
  },

  // Claves para localStorage
  storageKeys: {
    cacheKey: "greenhouse_plants_cache",
    themeKey: "greenhouse_theme",
    authKey: "greenhouse_current_user"  // Cambiado: ahora guarda el usuario actual
  },

  // Duración de caché
  cacheDuration: 1000 * 60 * 60,

  // DEMO USER ELIMINADO - ahora los usuarios vienen de data/users.json
  // Los usuarios se cargarán desde el archivo JSON local

  // Rutas de la aplicación
  routes: {
    login: "login.html",
    dashboard: "dashboard.html",
    plants: "plants.html",
    home: "index.html"
  }
};