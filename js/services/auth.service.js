import { APP_CONFIG } from "../config/config.js";

// Servicio de autenticación mejorado con JSON local
export async function login(email, password) {
  try {
    // Obtener usuarios del archivo JSON local
    const response = await fetch(APP_CONFIG.localData.users);
    const data = await response.json();
    const users = data.users;
    
    // Buscar usuario por email y password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Crear objeto de usuario sin la contraseña
      const currentUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        created_at: user.created_at
      };
      
      // Guardar en localStorage
      localStorage.setItem(APP_CONFIG.storageKeys.authKey, JSON.stringify(currentUser));
      
      return {
        success: true,
        user: currentUser,
        role: user.role
      };
    } else {
      return {
        success: false,
        message: "Correo o contraseña incorrectos."
      };
    }
  } catch (error) {
    console.error("Error en login:", error);
    return {
      success: false,
      message: "Error al cargar usuarios. Intente nuevamente."
    };
  }
}

export function logout() {
  localStorage.removeItem(APP_CONFIG.storageKeys.authKey);
  window.location.href = APP_CONFIG.routes.login;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(APP_CONFIG.storageKeys.authKey));
}

export function getCurrentUser() {
  const storedUser = localStorage.getItem(APP_CONFIG.storageKeys.authKey);
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

export function isUser() {
  const user = getCurrentUser();
  return user && user.role === "user";
}