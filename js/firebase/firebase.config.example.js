// ============================================================================
// Inicialización de Firebase
// ============================================================================

// Inicializa la app de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";



// Configuración del proyecto de Firebase
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inicialización
const app = initializeApp(firebaseConfig);

// Instancias de Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);

// Nombre de la colección de usuarios
export const USERS_COLLECTION = "users";
