// ============================================================================
// Capa de acceso a datos para el CRUD de perfiles de usuario en Firestore.
// Los documentos de la colección users contienen:
// { id: <docId>, name, email, role, created_at }
// ============================================================================

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

import { db, USERS_COLLECTION } from "./firebase.config.js";

// Referencia a la colección de usuarios
const usersRef = collection(db, USERS_COLLECTION);

// Convierte un snapshot de Firestore en un objeto con su id
function mapUser(docSnap) {
  return {
    id: docSnap.id,
    ...docSnap.data()
  };
}

// Obtiene todos los perfiles ordenados por fecha de creación
export async function getUsers() {
  const snapshot = await getDocs(
    query(usersRef, orderBy("created_at", "asc"))
  );

  return snapshot.docs.map(mapUser);
}

// Obtiene un perfil por su ID de documento
export async function getUserById(id) {
  const snapshot = await getDoc(
    doc(db, USERS_COLLECTION, id)
  );

  return snapshot.exists() ? mapUser(snapshot) : null;
}

// Obtiene un perfil mediante su correo electrónico
export async function getUserByEmail(email) {
  const snapshot = await getDocs(
    query(
      usersRef,
      where("email", "==", email),
      limit(1)
    )
  );

  return snapshot.empty ? null : mapUser(snapshot.docs[0]);
}

// Crea un nuevo perfil de usuario
export async function createUser(user) {
  const payload = {
    name: user.name,
    email: user.email,
    role: user.role || "admin",
    created_at:
      user.created_at ||
      new Date().toISOString().split("T")[0]
  };

  const ref = await addDoc(usersRef, payload);

  return {
    id: ref.id,
    ...payload
  };
}

// Actualiza un perfil por su ID de documento
export async function updateUser(id, changes) {
  await updateDoc(
    doc(db, USERS_COLLECTION, id),
    changes
  );

  return getUserById(id);
}

// Elimina un perfil por su ID de documento
export async function deleteUserById(id) {
  await deleteDoc(
    doc(db, USERS_COLLECTION, id)
  );

  return id;
}

// Inicializa la colección con los perfiles definidos en data/users.json
// únicamente cuando la colección se encuentra vacía.
export async function seedUsersIfEmpty(jsonPath) {
  const snapshot = await getDocs(
    query(usersRef, limit(1))
  );

  if (!snapshot.empty) {
    return false;
  }

  const response = await fetch(jsonPath);
  const data = await response.json();
  const seedUsers = data.users || [];

  await Promise.all(
    seedUsers.map((user) =>
      addDoc(usersRef, {
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      })
    )
  );

  return true;
}