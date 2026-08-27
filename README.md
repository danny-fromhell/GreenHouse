# Green House

Green House es una aplicación web enfocada en la consulta y visualización de información sobre plantas, sus características y cuidados.

El proyecto utiliza una arquitectura MVC con HTML, CSS y JavaScript, consume información de una API REST e integra Firebase Authentication y Cloud Firestore para la autenticación y gestión de usuarios.

---

## Objetivo del proyecto

Desarrollar una plataforma web dinámica que permita:

* Consultar información sobre plantas.
* Visualizar sus características y cuidados.
* Consumir información desde una API REST.
* Implementar autenticación de usuarios mediante Firebase Authentication.
* Gestionar usuarios mediante Cloud Firestore.
* Utilizar almacenamiento local y cookies para funciones de la aplicación.
* Mostrar métricas en un dashboard administrativo.
* Mantener una interfaz responsive con modo claro y oscuro.

---

## Funcionalidades principales

### Usuario general

* Visualización del catálogo de plantas.
* Consulta de información y cuidados.
* Búsqueda y filtrado de plantas.
* Navegación dinámica.
* Interfaz responsive.
* Modo claro y oscuro.

### Administrador

* Inicio de sesión mediante Firebase Authentication.
* Dashboard administrativo.
* Visualización de métricas y estadísticas.
* Gestión de usuarios.
* Consulta y modificación de información almacenada en Cloud Firestore.

---

## Tecnologías utilizadas

### Frontend

* HTML5
* CSS3
* JavaScript

### Arquitectura

* MVC (Model-View-Controller)

### Backend y servicios

* Firebase Authentication
* Cloud Firestore
* Perenual API

### Herramientas

* Git
* GitHub
* Jira

---

## Configuración

El proyecto utiliza archivos de configuración local que no se almacenan directamente en el repositorio para evitar publicar credenciales o claves asociadas a servicios externos.

### Firebase

El repositorio incluye el archivo:

```text
js/firebase/firebase.config.example.js
```

Crea una copia con el nombre:

```text
js/firebase/firebase.config.js
```

y sustituye los valores de ejemplo por la configuración correspondiente a tu proyecto de Firebase.

Ejemplo:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_FIREBASE_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

El archivo `firebase.config.js` está excluido mediante `.gitignore`.

### Perenual API

La aplicación permite configurar la API de Perenual desde:

```text
js/config/config.js
```

Agrega tu API key en la propiedad correspondiente:

```javascript
perenualApi: {
  baseUrl: "https://perenual.com/api/v2",
  apiKey: ""
}
```

No publiques claves privadas o credenciales dentro del repositorio.

---

## Estructura del proyecto

```text
GreenHouse/
│
├── index.html
├── plants.html
├── dashboard.html
├── login.html
├── users.html
│
├── js/
│   ├── config/
│   ├── controllers/
│   ├── firebase/
│   ├── services/
│   ├── utils/
│   ├── views/
│   └── main.js
│
├── css/
├── assets/
├── data/
├── .gitignore
└── README.md
```

---

## Flujo de trabajo con Git y ramas

Para mantener organizada la colaboración del equipo se utilizó una rama principal (`main`), una rama de integración (`dev`) y ramas individuales para cada integrante.

### Estructura de ramas

```text
main
└── dev
    ├── dannyDev
    ├── abiDev
    ├── tonaDev
    ├── flaviaDev
    ├── axelDev
    └── luisDev
```

### `main`

Contiene la versión final y estable del proyecto.

### `dev`

Rama utilizada para integrar y probar los cambios del equipo antes de incorporarlos a `main`.

### Ramas individuales

Cada integrante trabajó en su propia rama para mantener separados los cambios durante el desarrollo.

| Rama | Integrante |
| --- | --- |
| `dannyDev` | Danny |
| `abiDev` | Abi |
| `tonaDev` | Tona |
| `flaviaDev` | Flavia |
| `axelDev` | Axel |
| `luisDev` | Luis |

---

## Flujo de trabajo

1. Cada integrante desarrolla funcionalidades en su propia rama.
2. Los cambios se registran mediante commits.
3. Se crea un Pull Request hacia `dev`.
4. Se revisa y prueba la integración.
5. Los cambios validados se incorporan a `main`.

---

## Reglas de trabajo

* No trabajar directamente sobre `main`.
* Integrar cambios mediante Pull Requests.
* Mantener sincronizadas las ramas de desarrollo.
* Realizar commits descriptivos.
* Verificar el funcionamiento antes de realizar un merge.

---

## Integrantes del equipo

| Integrante | Responsabilidad |
| --- | --- |
| Danny | Arquitectura MVC, lógica principal y conexión con API REST. |
| Abi | Sketch del sitio, dashboard y pantalla de usuarios. |
| Flavia | Manejo de datos y cookies. |
| Tona | Creación e integración de la base de datos. |
| Axel | Implementación inicial del sistema de autenticación. |
| Luis | Integración, pruebas y correcciones. |

---

## Requisitos del proyecto

* Consumo de API REST.
* Arquitectura MVC.
* Diseño responsive.
* Dashboard administrativo.
* Gestión de usuarios.
* Uso de GitHub y Pull Requests.
* Modo claro y oscuro.
* Presentación funcional.

## Estado del proyecto

Green House cuenta con una versión funcional que integra los principales
requerimientos planteados para la aplicación:

* Consulta y visualización de información sobre plantas.
* Búsqueda y filtrado del catálogo.
* Consumo de la API REST de Perenual.
* Autenticación de usuarios mediante Firebase Authentication.
* Gestión de usuarios mediante Cloud Firestore.
* Dashboard administrativo con métricas y estadísticas.
* Arquitectura MVC.
* Almacenamiento local y uso de cookies.
* Diseño responsive.
* Modo claro y oscuro.

Actualmente se conserva como proyecto académico y de portafolio para demostrar
el desarrollo de aplicaciones web con JavaScript, arquitectura MVC, consumo de
APIs REST, autenticación, integración con servicios en la nube y persistencia
de información.

## Licencia

Este proyecto fue desarrollado con fines académicos y demostrativos.
