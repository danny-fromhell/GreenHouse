// ============================================================================
//  Capa de acceso a datos para el CRUD sobre la colección de users em Firestore.
//  Todas las funciones devuelven Promesas y mapean cada documento a:
//      { id: <docId>, name, email, password, role, created_at }
//  donde `id` es el ID del documento de Firestore (string).
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

// Referencia a la colección
const usersRef = collection(db, USERS_COLLECTION);

// Convierte un snapshot de documento en un objeto plano con su id
function mapUser(docSnap) {
  return { id: docSnap.id, ...docSnap.data() };
}

// Se hacen todos los snapshot de los usuarios
export async function getUsers() {
  const snapshot = await getDocs(query(usersRef, orderBy("created_at", "asc")));
  return snapshot.docs.map(mapUser);
}

// Se crea un usuario por id de documento 
export async function getUserById(id) {
  const snapshot = await getDoc(doc(db, USERS_COLLECTION, id));
  return snapshot.exists() ? mapUser(snapshot) : null;
}

// se checa por email (para login y que no haya duplicados)
export async function getUserByEmail(email) {
  const snapshot = await getDocs(
    query(usersRef, where("email", "==", email), limit(1))
  );
  return snapshot.empty ? null : mapUser(snapshot.docs[0]);
}

// Se crea un usuario nuevo
export async function createUser(user) {
  const payload = {
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role || "admin",
    created_at: user.created_at || new Date().toISOString().split("T")[0]
  };

  const ref = await addDoc(usersRef, payload);
  return { id: ref.id, ...payload };
}

// Se actualiza un usuario por id de documento (changes es un objeto con los campos a actualizar)
export async function updateUser(id, changes) {
  await updateDoc(doc(db, USERS_COLLECTION, id), changes);
  return getUserById(id);
}

// Elimina un usuario por id de documento 
export async function deleteUserById(id) {
  await deleteDoc(doc(db, USERS_COLLECTION, id));
  return id;
}

// Esto checa si la colección de usuarios está vacía y, si lo está, la llena con el JSON en data/users.json.
//  Nomas irve para la primera ejecución, pa no tener que cargar los datos a mano.
//  Devuelve true si se insertaron datos, false si la colección ya tenía usuarios.
export async function seedUsersIfEmpty(jsonPath) {
  const snapshot = await getDocs(query(usersRef, limit(1)));
  if (!snapshot.empty) return false;

  const response = await fetch(jsonPath);
  const data = await response.json();
  const seedUsers = data.users || [];

  await Promise.all(
    seedUsers.map((u) =>
      addDoc(usersRef, {
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role,
        created_at: u.created_at
      })
    )
  );

  return true;
}
