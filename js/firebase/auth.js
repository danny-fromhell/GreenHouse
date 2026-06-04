// ============================================================================
//  Se hace la validación de credenciales contra la colección users en Firestore.
// ============================================================================

import { getUserByEmail, seedUsersIfEmpty } from "./firestore.js";
import { APP_CONFIG } from "../config/config.js";

// Devuelve el objeto de usuario (sin password) si las credenciales son
// correctas, o null si no lo son.
export async function loginWithFirestore(email, password) {
  // Garantiza que existan usuarios la primera vez que se usa la app.
  await seedUsersIfEmpty(APP_CONFIG.localData.users);

  const user = await getUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    created_at: user.created_at
  };
}
