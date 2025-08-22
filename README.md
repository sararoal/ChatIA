# ChatIA

Aplicación web de chat inteligente que conecta a los usuarios con una inteligencia artificial capaz de completar frases y responder preguntas de forma coherente y sencilla.

## 🚀 Tecnologías utilizadas

- **Frontend:** React, Zustand, Axios
- **Backend:** Node.js, Express, Axios, Mongoose
- **Bases de datos:** MongoDB (conversaciones), MySQL (usuarios)
- **Autenticación:** JWT, Middleware personalizado
- **Orquestación:** Docker Compose
- **API IA:** OpenRouter AI

## 🖥️ Características principales

- Chat en tiempo real con IA (modelo LLaMA u otros de OpenRouter)
- Registro y login de usuarios
- Persistencia de conversaciones y usuarios
- Interfaz moderna y responsive
- Gestión de sesiones y autenticación segura
- Fácil despliegue con Docker Compose

## 📦 Instalación y ejecución

### Pasos

1. **Clona el repositorio:**

   ```sh
   git clone https://github.com/tuusuario/ChatIA.git
   cd ChatIA
   ```

2. **Configura los archivos `.env`:**

   Antes de arrancar el proyecto, debes crear y configurar los archivos `.env` en las carpetas `frontend` y `backend`. Aquí tienes qué poner en cada uno:

   #### Frontend (`frontend/.env`)

   ```properties
   VITE_API_URI=http://localhost:3000
   ```
   - **VITE_API_URI:** URL donde está corriendo el backend. Si usas Docker y todo está en local, déjalo así.

   #### Backend (`backend/.env`)

   ```properties
   DB_NAME=chatia
   DB_USER=user
   DB_PASSWORD=user
   DB_HOST=db
   DB_PORT=3306

   MONGO_URI=mongodb://mongo:27017/chatia

   JWT_SECRET=tu_clave_secreta

   OPENROUTER_API_KEY=tu_api_key_de_openrouter
   ```
   - **DB_NAME:** Nombre de la base de datos MySQL (por defecto `chatia`).
   - **DB_USER:** Usuario de la base de datos MySQL (por defecto `user`).
   - **DB_PASSWORD:** Contraseña del usuario de MySQL (por defecto `user`).
   - **DB_HOST:** Nombre del servicio de MySQL en Docker Compose (`db`).
   - **DB_PORT:** Puerto de MySQL (por defecto `3306`).
   - **MONGO_URI:** URI de conexión a MongoDB (por defecto `mongodb://mongo:27017/chatia`).
   - **JWT_SECRET:** Clave secreta para firmar los tokens JWT (elige una cadena segura).
   - **OPENROUTER_API_KEY:** Tu clave de API de OpenRouter para acceder a la IA (debes obtenerla en [openrouter.ai](https://openrouter.ai/)).

   > **Nota:**  
   > No subas los archivos `.env` a repositorios públicos. Si cambias los valores, reinicia los servicios para que los cambios tengan efecto.

3. **Arranca todos los servicios:**

   ```sh
   docker-compose up --build
   ```

4. **Accede a la aplicación:**

   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)
   - Mongo Express: [http://localhost:8081](http://localhost:8081)
   - phpMyAdmin: [http://localhost:8080](http://localhost:8080)

## ⚙️ Estructura del proyecto

```
ChatIA/
├── backend/
├── frontend/
├── docker-compose.yml
├── README.md
└── ...
```

- **backend/**: Servidor Node.js/Express, lógica de negocio, conexión a bases de datos y API de IA.
- **frontend/**: Aplicación React, componentes de interfaz y gestión de estado.
- **docker-compose.yml**: Orquestación de servicios y bases de datos.

## 📝 Uso

1. Regístrate o inicia sesión.
2. Escribe el inicio de una frase o una pregunta.
3. La IA completará tu frase o responderá de forma coherente.
4. Consulta y gestiona tus conversaciones guardadas.

## 🛡️ Seguridad

- Autenticación JWT y middleware para proteger rutas privadas.
- Variables de entorno para claves sensibles.
- Gestión de permisos en bases de datos.

## 📚 Créditos y agradecimientos

- [OpenRouter AI](https://openrouter.ai/)
- [React](https://react.dev/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [MySQL](https://www.mysql.com/)

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

¡Gracias por probar ChatIA! Si tienes sugerencias o encuentras algún problema, no dudes en abrir un issue o enviar un pull request.