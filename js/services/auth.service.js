import { APP_CONFIG } from "../config/config.js";

// ── Helpers de cookies ─────────────────────────────────────────────────
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
}

function getCookie(name) {
  const key = name + '=';
  const cookies = document.cookie.split(';');
  for (let c of cookies) {
    c = c.trim();
    if (c.startsWith(key)) {
      return decodeURIComponent(c.substring(key.length));
    }
  }
  return null;
}

function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict`;
}

const COOKIE_NAME = 'gh_session';
const COOKIE_DAYS = 7;

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
      // Guardar en cookie para persistencia
      setCookie(COOKIE_NAME, JSON.stringify(currentUser), COOKIE_DAYS);
      
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
  deleteCookie(COOKIE_NAME); 
  window.location.href = APP_CONFIG.routes.login;
}

export function isAuthenticated() {
  // Verificar localStorage primero
  if (localStorage.getItem(APP_CONFIG.storageKeys.authKey)) return true;

  // Si no hay localStorage pero sí cookie, restaurar sesión desde cookie
  const cookieSession = getCookie(COOKIE_NAME);
  if (cookieSession) {
    localStorage.setItem(APP_CONFIG.storageKeys.authKey, cookieSession);
    return true;
  }

  return false;
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