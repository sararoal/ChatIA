import { getConnection } from "./db.js";

export async function createUsuariosTable() {
  let connection;
  try {
    connection = await getConnection();

    console.log("🔄 - Intentando crear la tabla 'usuarios'...");
    await connection.execute(
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100),
        apellido VARCHAR(100),
        email VARCHAR(100) UNIQUE,
        password VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL
      )`
    );
    console.log("✅ - Tabla 'usuarios' creada o ya existe.");
  } catch (error) {
    console.error("❌ - Error con la tabla 'usuarios':", error.message);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔒 - Conexión a la base de datos cerrada.");
    }
  }
}