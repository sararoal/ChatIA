import mysql from "mysql2/promise";
import { config } from "../config/config.js";
import { createUsuariosTable } from "./usuarios.table.js";

export async function getConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || config.db.host,
      user: process.env.DB_USER || config.db.user,
      password: process.env.DB_PASSWORD || config.db.password,
      database: process.env.DB_NAME || config.db.database,
      port: process.env.DB_PORT || config.db.port,
    });
    console.log(`✅ - Conectado a la base de datos ${process.env.DB_NAME}`);
    return connection;
  } catch (error) {
    console.error("❌ - Error al conectar con la base de datos:", error.message);
    throw error;
  }
}

// Función para inicializar la base de datos
export async function initDatabase() {
  try {
    await createUsuariosTable();
    console.log("✅ - Base de datos inicializada correctamente.");
  } catch (error) {
    console.error("❌ - Error al inicializar la base de datos:", error.message);
    throw error;
  }
}