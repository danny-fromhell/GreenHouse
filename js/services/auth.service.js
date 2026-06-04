import { APP_CONFIG } from "../config/config.js";
import { loginWithFirestore } from "../firebase/auth.js";
import { setCookie, getCookie, deleteCookie } from "../utils/cookie.utils.js";
import { generateFakeJWT, decodeJWTPayload, isJWTExpired } from "../utils/jwt.utils.js";

const COOKIE_NAME = "gh_token";
const COOKIE_MAX_AGE = 3600;

export async function login(email, password) {
  try {
    const currentUser = await loginWithFirestore(email, password);

    if (!currentUser) {
      return {
        success: false,
        message: "Correo o contraseña incorrectos."
      };
    }

    const token = generateFakeJWT(currentUser);

    setCookie(COOKIE_NAME, token, COOKIE_MAX_AGE);
    localStorage.setItem(APP_CONFIG.storageKeys.authKey, JSON.stringify(currentUser));

    console.log("JWT generado:", token);
    console.log("Payload decodificado:", decodeJWTPayload(token));

    return {
      success: true,
      user: currentUser,
      role: currentUser.role,
      token
    };
  } catch (error) {
    console.error("Error en login:", error);

    return {
      success: false,
      message: "Error al iniciar sesión. Intente nuevamente."
    };
  }
}

export function logout() {
  clearSession();
  window.location.href = APP_CONFIG.routes.login;
}

export function isAuthenticated() {
  const token = getCookie(COOKIE_NAME);

  if (!token) {
    clearSession();
    return false;
  }

  if (isJWTExpired(token)) {
    clearSession();
    return false;
  }

  restoreUserFromToken(token);
  return true;
}

export function getCurrentUser() {
  const token = getCookie(COOKIE_NAME);

  if (!token) {
    clearSession();
    return null;
  }

  if (isJWTExpired(token)) {
    clearSession();
    return null;
  }

  restoreUserFromToken(token);

  const storedUser = localStorage.getItem(APP_CONFIG.storageKeys.authKey);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error("Error al leer usuario de localStorage:", error);
    clearSession();
    return null;
  }
}

export function isAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

export function isUser() {
  const user = getCurrentUser();
  return user && user.role === "user";
}

function restoreUserFromToken(token) {
  const payload = decodeJWTPayload(token);

  if (!payload) {
    clearSession();
    return;
  }

  const userFromToken = {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role
  };

  localStorage.setItem(APP_CONFIG.storageKeys.authKey, JSON.stringify(userFromToken));
}

function clearSession() {
  deleteCookie(COOKIE_NAME);
  localStorage.removeItem(APP_CONFIG.storageKeys.authKey);
}