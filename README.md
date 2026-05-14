# Green House

Green House es una aplicación web enfocada en la consulta y visualización de información sobre plantas, sus características y cuidados. El proyecto utiliza una arquitectura MVC con HTML, CSS y JavaScript, además de consumo de API REST y autenticación JWT para el módulo administrativo.

---

# Objetivo del proyecto

Desarrollar una plataforma web dinámica que permita:

* Consultar información de plantas
* Visualizar cuidados y características
* Consumir una API REST
* Implementar autenticación JWT
* Utilizar almacenamiento en caché
* Mostrar métricas en un dashboard administrativo

---

# Funcionalidades principales

## Usuario general

* Visualización de catálogo de plantas
* Consulta de información y cuidados
* Interfaz responsive
* Navegación dinámica
* Modo claro y oscuro
* Búsqueda y filtrado de plantas

## Administrador

* Inicio de sesión mediante JWT
* Dashboard de métricas
* Gestión de plantas
* Visualización de estadísticas
* Monitoreo de interacciones y ventas

---

# Tecnologías utilizadas

## Frontend

* HTML
* CSS
* JavaScript 

## Arquitectura

* MVC (Model View Controller)

## Herramientas

* Git
* GitHub
* Jira
* Figma

## Extras

* API REST
* JWT Authentication
* LocalStorage
* JSON

---

# Estructura del proyecto

```txt
GreenHouse/
│
├── index.html
├── plants.html
├── dashboard.html
├── login.html
│
├── js/
│   ├── config/
│   │   └── config.js
│   │
│   ├── services/
│   │   ├── api.service.js
│   │   ├── auth.service.js
│   │   └── cache.js
│   │
│   ├── controllers/
│   │   ├── plants.controller.js
│   │   ├── auth.controller.js
│   │   └── dashboard.controller.js
│   │
│   ├── views/
│   │   ├── plants.view.js
│   │   ├── dashboard.view.js
│   │   └── home.view.js
│   │
│   ├── utils/
│   │   └── utils.js
│   │
│   └── main.js
│
├── css/
├── assets/
├── data/
└── README.md
```

---

# Integrantes del equipo

| Integrante | Responsabilidad                         |
| ---------- | --------------------------------------- |
| Danny      | Diseño de FrontEnd y repositorio GitHub |
| Abi        | Arquitectura MVC                        |
| Tona       | Configuración, datos y caché            |
| Flavia     | Lógica principal e interfaz             |
| Axel       | Utilidades y apoyo                      |
| Luis       | Integración y pruebas                   |

---

# Requisitos del proyecto

* Consumo de API REST
* Arquitectura MVC
* Responsive Design
* Dashboard administrativo
* Uso de GitHub y Pull Requests
* Modo claro y oscuro
* Presentación funcional

