# 🎮 E-commerce Gamer

## 📌 Descripción del proyecto

Este proyecto consiste en el desarrollo de una **plataforma de venta de videojuegos** utilizando React. El sistema permite a los usuarios consultar un catálogo de juegos, visualizar información detallada y gestionar una lista de deseos.

Además, cuenta con un **panel de administración** que permite gestionar el inventario de juegos mediante operaciones CRUD.

El proyecto fue desarrollado de manera grupal, distribuyendo las diferentes tareas necesarias para la creación del catálogo, sistema de usuarios, administración y diseño de la plataforma.

---

## 🎯 Objetivos

- Crear una plataforma funcional de venta de videojuegos.
- Implementar un catálogo dinámico de juegos.
- Permitir la búsqueda de juegos por nombre.
- Mostrar información detallada de cada juego.
- Implementar persistencia de datos mediante `LocalStorage`.
- Crear un sistema de autenticación simulado.
- Diferenciar usuarios administradores de usuarios invitados.
- Crear un panel de administración con CRUD.
- Implementar un diseño completamente responsive.
- Aplicar buenas prácticas de organización y calidad de código.

## 🛠️ Tecnologías utilizadas

- ⚛️ React
- 📘 TypeScript / TSX
- 🎨 CSS
- 🅱️ Bootstrap
- 🧭 React Router DOM
- 💾 LocalStorage
- 📦 npm
- ⚡ Vite

# 📂 Estructura del proyecto

```text
ecommerce-gamer/
│
├── public/
│   └── images/
│
├── src/
│   ├── assents
│   │ 
│   ├── components/
│   │   ├── Footer/
│   │   │  ├── Footer.css
│   │   │  └── Footer.tsx
│   │   ├── GameCardNavbar/
│   │   │  └── GameCardNavbar.tsx
│   │   ├── Gamelist/
│   │   │  └──  Gamelist.tsx
│   │   ├── logoutbutton/
│   │   │  └── logoutbutton.tsx
│   │   ├── Navbar/
│   │   │  ├── Navbar.css
│   │   │  └── Navbar.tsx
│   │   ├── ProtectedRoute/
│   │   │  └── ProtectedRoute.tsx
│   │   └── searchbar/
│   │      └── searchbar.tsx
│   │   
│   ├── contexts/
│   │   ├── AuthContext.ts
│   │   ├── Authprovider.tsx 
│   │   ├── Gamerscontext.ts
│   │   └── Gamersprovider.tsx
│   ├── pages/
│   │   ├── adminpage/
│   │   │  └── adminpage.tsx
│   │   ├── gamedetailpage/
│   │   │  └── gamedetailpage.tsx
│   │   ├── homepage/
│   │   │  └── homepage.tsx
│   │   ├── loginpage/
│   │   │  └── loginpage.tsx
│   │
│   ├── data/
│   │   ├── seedgame.ts
│   │   └── seedUsers.ts
│   │
│   ├── hooks/
│   │   ├── useAunth.ts
│   │   └── usegames.ts
│   │
│   ├── interfaces/
│   │   ├── game.ts
│   │   └── userr.ts
│   │
│   ├── services/
│   │   └── localstorageSevice.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .gitgnore
├── eslint.confing.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── tscomfing.app,json
├── tscomfing.json
└── vite.config.ts


# 💾 Gestión de estado y persistencia

El proyecto utiliza **LocalStorage** para mantener los datos aunque el usuario cierre o actualice el navegador.

Se utiliza para almacenar información como:

- Catálogo de juegos.
- Usuarios registrados.
- Usuario actualmente autenticado.
- Inventario.
- Lista de deseos.

### useEffect

Se utiliza el hook `useEffect` para detectar cambios y guardar automáticamente la información actualizada en `LocalStorage`.

Ejemplo:

```tsx
useEffect(() => {
  localStorage.setItem("games", JSON.stringify(games));
}, [games]);
```

De esta manera, cada vez que se modifica el inventario, los cambios se guardan automáticamente.

---

# 🧭 Enrutamiento

El proyecto utiliza **React Router DOM** para administrar las diferentes rutas.

| Ruta | Descripción |
|---|---|
| `/` | Página principal con el catálogo |
| `/detalle/:id` | Información detallada del juego |
| `/admin` | Panel de administración |
| `/about` | Información del equipo de desarrollo |
| `/404` | Página de error personalizada |

Las rutas de administración están protegidas mediante lógica de autorización para impedir el acceso a usuarios que no tengan permisos de administrador.

# 👤 Usuario visitante / invitado

Los usuarios pueden:

- Visualizar el catálogo.
- Buscar juegos por nombre.
- Consultar información de los juegos.
- Ver precio y categoría.
- Ver imágenes.
- Consultar descripción.
- Consultar requisitos del sistema.
- Consultar información del desarrollador.

# 🔎 Catálogo de juegos

El catálogo permite buscar juegos mediante su nombre.

Cada juego contiene información como:

```text
Nombre
Precio
Categoría
Imagen
Descripción
Requisitos del sistema
Desarrollador
```

Las categorías pueden incluir:

- Aventura
- Acción
- Simulación
- Estrategia
- Deportes
- RPG
- Terror
- Carreras

---

# ⭐ Sistema de reseñas

El sistema de reseñas es una funcionalidad opcional.

Los usuarios autenticados pueden realizar una reseña de un juego indicando:

- Descripción.
- Voto positivo o negativo.

El sistema puede calcular dinámicamente la cantidad de reseñas positivas y negativas.

---

# ❤️ Lista de deseos

La lista de deseos permite a los usuarios autenticados guardar sus juegos favoritos.

El usuario puede:

- Agregar juegos.
- Eliminar juegos.
- Visualizar sus juegos favoritos.

La información de la lista de deseos se mantiene mediante `LocalStorage`.

---

# 👨‍💻 Panel de administración

El administrador dispone de un panel exclusivo para gestionar el catálogo.

### CRUD de juegos

El administrador puede:

- ➕ Crear juegos.
- 👁️ Leer y visualizar juegos.
- ✏️ Editar juegos.
- 🗑️ Eliminar juegos.

La información se muestra mediante una tabla de administración.

---

# 👥 Gestión de usuarios

Si se implementa el registro de usuarios, el administrador podrá acceder a una tabla con los usuarios registrados.

Las funcionalidades incluyen:

- Visualizar usuarios.
- Consultar información.
- Eliminar usuarios.

---

# 🔐 Autenticación

El proyecto utiliza un sistema de autenticación simulado.

Cuenta con:

### Login

Permite al usuario ingresar mediante sus credenciales.

### Roles

El sistema diferencia entre:

- **Administrador**
- **Usuario / Invitado**

El administrador se encuentra precargado en el sistema.

El acceso a `/admin` está restringido mediante una ruta protegida.

---

# 📱 Diseño responsive

La aplicación está diseñada para funcionar correctamente en:

- 📱 Celulares.
- 📲 Tablets.
- 💻 Computadoras.
- 🖥️ Pantallas grandes.

Se utilizan componentes responsive de Bootstrap y estilos CSS adaptables.

---

# 📜 Scripts disponibles

Los scripts se encuentran definidos en el archivo `package.json`, dentro de la propiedad `"scripts"`.

Ejemplo:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

### Iniciar el proyecto

```bash
npm run dev
```

### Crear la versión de producción

```bash
npm run build
```

### Previsualizar la versión de producción

```bash
npm run preview
```

### Analizar el código

```bash
npm run lint
```

---

# 🚀 Instalación y ejecución

Para ejecutar el proyecto localmente:

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

### 2. Ingresar a la carpeta

```bash
cd ecommerce-gamer
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Ejecutar el proyecto

```bash
npm run dev
```

Luego ingresar desde el navegador a la dirección indicada por Vite, normalmente:

```text
http://localhost:5173
```

---

# 🧪 Calidad de código

Durante el desarrollo se busca mantener:

- Código limpio y organizado.
- Componentes reutilizables.
- Separación de responsabilidades.
- Nombres descriptivos.
- Uso adecuado de hooks.
- Estructura de carpetas organizada.
- Diseño responsive.
- Control de errores y rutas inexistentes.

---

# 📋 Metodología de trabajo

El proyecto se organiza utilizando **metodologías ágiles**.

Se utiliza un tablero grupal de **Trello** para:

- Distribuir tareas.
- Organizar actividades.
- Registrar avances.
- Asignar responsables.
- Controlar las tareas pendientes.
- Dar seguimiento al desarrollo.

---

# Equipo de desarrollo

Proyecto desarrollado de manera grupal.

### Integrantes

- Leandro Medina
- Franco Benjamin Pascual
- Eduardo Romano
- Samir Casesola

# Publicación

El proyecto puede ser publicado utilizando plataformas de hosting como:

- Netlify
- Vercel

Una vez publicado, se agregará aquí el enlace correspondiente:
```text
https://URL-DE-TU-PROYECTO
```