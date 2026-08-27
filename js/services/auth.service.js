import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import { APP_CONFIG } from "../config/config.js";
import { auth } from "../firebase/firebase.config.js";
import { loginWithFirebase } from "../firebase/auth.js";
import { setCookie, getCookie, deleteCookie } from "../utils/cookie.utils.js";

const COOKIE_NAME = "gh_session";
const COOKIE_MAX_AGE = 3600;

export async function login(email, password) {
  try {
    const currentUser = await loginWithFirebase(email, password);

    if (!currentUser) {
      return {
        success: false,
        message: "Correo o contraseña incorrectos."
      };
    }

    // Cookie de sesión utilizada como parte de los requisitos del proyecto.
    // No almacena credenciales ni información sensible.
    setCookie(COOKIE_NAME, "active", COOKIE_MAX_AGE);

    localStorage.setItem(
      APP_CONFIG.storageKeys.authKey,
      JSON.stringify(currentUser)
    );

    return {
      success: true,
      user: currentUser,
      role: currentUser.role
    };
  } catch (error) {
    console.error("Error en login:", error);

    return {
      success: false,
      message: "Error al iniciar sesión. Intente nuevamente."
    };
  }
}

export async function logout() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión en Firebase:", error);
  } finally {
    clearSession();
    window.location.href = APP_CONFIG.routes.login;
  }
}

export function isAuthenticated() {
  const session = getCookie(COOKIE_NAME);

  if (session !== "active") {
    clearSession();
    return false;
  }

  return getCurrentUser() !== null;
}

export function getCurrentUser() {
  const session = getCookie(COOKIE_NAME);

  if (session !== "active") {
    clearSession();
    return null;
  }

  const storedUser = localStorage.getItem(
    APP_CONFIG.storageKeys.authKey
  );

  if (!storedUser) {
    clearSession();
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
  return user?.role === "admin";
}

export function isUser() {
  const user = getCurrentUser();
  return user?.role === "user";
}

function clearSession() {
  deleteCookie(COOKIE_NAME);
  localStorage.removeItem(APP_CONFIG.storageKeys.authKey);
}