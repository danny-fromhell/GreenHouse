import { APP_CONFIG } from "../config/config.js";

export function login(email, password) {
  const validEmail = email === APP_CONFIG.demoUser.email;
  const validPassword = password === APP_CONFIG.demoUser.password;

  if (!validEmail || !validPassword) {
    return {
      success: false,
      message: "Correo o contraseña incorrectos."
    };
  }

  const fakeToken = btoa(`${email}:${Date.now()}`);

  localStorage.setItem(APP_CONFIG.authKey, fakeToken);

  return {
    success: true,
    token: fakeToken
  };
}

export function logout() {
  localStorage.removeItem(APP_CONFIG.authKey);
  window.location.href = "login.html";
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem(APP_CONFIG.authKey));
}