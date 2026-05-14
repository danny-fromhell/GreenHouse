# Green House

---

# Flujo de trabajo con Git y ramas

Para mantener una organización adecuada del proyecto y cumplir con el requisito de utilizar una branch principal (`main`) y Pull Requests por integrante, se implementó la siguiente estructura de ramas:

## Estructura de ramas

```txt id="x1zw95"
main
└── dev
    ├── dannyDev
    ├── abiDev
    ├── tonaDev
    ├── flaviaDev
    ├── axelDev
    └── luisDev
```

## Descripción de ramas

### `main`

Contiene la versión final y estable del proyecto.

### `dev`

Rama de integración general donde se realizan las pruebas y merges del trabajo del equipo antes de pasar a producción.

### Ramas individuales

Cada integrante trabaja únicamente en su propia rama para evitar conflictos y mantener organizado el desarrollo.

| Rama      | Integrante |
| --------- | ---------- |
| dannyDev  | Danny      |
| abiDev    | Abi        |
| tonaDev   | Tona       |
| flaviaDev | Flavia     |
| axelDev   | Axel       |
| luisDev   | Luis       |

---

# Flujo de trabajo

1. Cada integrante desarrolla funcionalidades en su propia rama.
2. Los cambios se suben al repositorio mediante commits.
3. Se crea un Pull Request hacia la rama `dev`.
4. Después de validar la integración y funcionamiento del proyecto, los cambios de `dev` se integran a `main`.

---

# Reglas de trabajo

* No trabajar directamente sobre `main`
* Todos los cambios deben pasar por Pull Request
* Mantener sincronizada la rama personal con `dev`
* Realizar commits descriptivos y organizados
* Verificar funcionamiento antes de hacer merge


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

