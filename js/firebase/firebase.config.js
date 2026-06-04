// ============================================================================
//  Inicializa la app de Firebase y .
// ============================================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// Aquí va la configuración del proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEHDn05H6stw31sfs7uq-gy93SGk0C88U",
  authDomain: "greenhouse-cac64.firebaseapp.com",
  projectId: "greenhouse-cac64",
  storageBucket: "greenhouse-cac64.firebasestorage.app",
  messagingSenderId: "963943137494",
  appId: "1:963943137494:web:a97e80f6e0570cd1460977"
};

// Inicialización
const app = initializeApp(firebaseConfig);

// Instancia de Firestore que reutiliza todo el proyecto
export const db = getFirestore(app);

// Nombre de la colección de usuarios
export const USERS_COLLECTION = "users";
