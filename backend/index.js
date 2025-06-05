// Carga variables de entorno lo primero
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "node:http";

// Importar configuración y funciones
import { config } from "./config/config.js";
import { setupSocket } from "./config/sockets.js";

// Importar conexiones a bases de datos
import { initDatabase } from "./database/db.js";
import { connectToMongo } from "./mongo/connection.js";

// Importar rutas
import usuariosRoutes from "./routes/usuarios.routes.js";
import authRoutes from "./routes/auth.routes.js";
import apiRoutes from "./routes/chat.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

const app = express();
const port = config.server.port || 3000;
const server = createServer(app);

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas API
app.use("/api", apiRoutes);
app.use("/usuario", usuariosRoutes);
app.use("/auth", authRoutes);
app.use("/conversation", conversationRoutes);
app.use("/chat", conversationRoutes);

// Configurar WebSockets si tienes
setupSocket(server);

async function startServer() {
  try {
    console.log("🔄 - Inicializando la base de datos...");
    await initDatabase();

    console.log("🔄 - Conectando a MongoDB...");
    await connectToMongo();

    server.listen(port, () => {
      console.log(`✅ - Servidor ejecutándose en http://localhost:${port}`);
    });
  } catch (error) {
    console.error("❌ - Error al inicializar el servidor o la base de datos:", error.message);
    process.exit(1);
  }
}

startServer();
