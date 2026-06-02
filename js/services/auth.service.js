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

// ── JWT simulado ───────────────────────────────────────────────────────

function base64url(str) {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function generateFakeJWT(user) {
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));

  const payload = base64url(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    iat: Math.floor(Date.now() / 1000),        // issued at (ahora)
    exp: Math.floor(Date.now() / 1000) + 3600  // expira en 1 hora
  }));

  const fakeSignature = base64url("greenhouse-fake-signature-" + user.id);
  return `${header}.${payload}.${fakeSignature}`;
}

function decodeJWTPayload(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload + '=='.slice(0, (4 - payload.length % 4) % 4);
    return JSON.parse(decodeURIComponent(escape(atob(padded.replace(/-/g, '+').replace(/_/g, '/')))));
  } catch (e) {
    console.error("Error decodificando JWT:", e);
    return null;
  }
}

function isJWTExpired(token) {
  const payload = decodeJWTPayload(token);
  if (!payload || !payload.exp) return true;
  return Math.floor(Date.now() / 1000) > payload.exp;
}

const COOKIE_NAME = 'gh_token';
const COOKIE_DAYS = 1;

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
      
      
      // Generar JWT simulado
const fakeJwt = generateFakeJWT(currentUser);

// Guardar JWT en cookie
document.cookie = `${COOKIE_NAME}=${fakeJwt}; path=/; max-age=3600; SameSite=Strict`;

// Respaldo en localStorage
localStorage.setItem(APP_CONFIG.storageKeys.authKey, JSON.stringify(currentUser));

console.log("JWT generado:", fakeJwt);
console.log("Payload decodificado:", decodeJWTPayload(fakeJwt));
      
      return {
        success: true,
        user: currentUser,
        role: user.role,
        token: fakeJwt
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
  // 1. Verificar JWT en cookie
  const token = getCookie(COOKIE_NAME);
  if (token && !isJWTExpired(token)) {
    // Restaurar sesión desde JWT si no hay localStorage
    if (!localStorage.getItem(APP_CONFIG.storageKeys.authKey)) {
      const payload = decodeJWTPayload(token);
      if (payload) {
        const userFromToken = {
          id: payload.sub,
          email: payload.email,
          name: payload.name,
          role: payload.role
        };
        localStorage.setItem(APP_CONFIG.storageKeys.authKey, JSON.stringify(userFromToken));
      }
    }
    return true;
  }

  // 2. Si el token expiró, limpiar todo
  if (token && isJWTExpired(token)) {
    deleteCookie(COOKIE_NAME);
    localStorage.removeItem(APP_CONFIG.storageKeys.authKey);
    return false;
  }

  // 3. Fallback: verificar localStorage
  return !!localStorage.getItem(APP_CONFIG.storageKeys.authKey);
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