// ============================================================================
// Autenticación de usuarios mediante Firebase Authentication
// ============================================================================

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-auth.js";

import { auth } from "./firebase.config.js";
import { getUserByEmail } from "./firestore.js";

/**
 * Autentica al usuario mediante Firebase Authentication y recupera
 * su información de perfil desde Firestore.
 *
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object|null>}
 */
export async function loginWithFirebase(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    const profile = await getUserByEmail(credential.user.email);

    if (!profile) {
      return null;
    }

    return {
      id: profile.id,
      email: credential.user.email,
      name: profile.name,
      role: profile.role,
      created_at: profile.created_at
    };
  } catch (error) {
    console.error("Error de autenticación:", error.code);
    return null;
  }
}