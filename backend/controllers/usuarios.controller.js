import { getConnection } from "../database/db.js";
import { hashPassword } from "../utils/password.utils.js";

export async function getUsuarios(req, res) {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute("SELECT * FROM usuarios");
    res.json(rows);
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getUsuarioById(req, res) {
  const { id } = req.params;
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(rows[0]);
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createUsuario(req, res) {
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ message: "Faltan datos requeridos" });
  }

  try {
    const connection = await getConnection();
    const { salt, hash } = hashPassword(password);
    await connection.execute(
      "INSERT INTO usuarios (nombre, apellido, email, password, salt) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, email, hash, salt]
    );
    res.status(201).json({ message: "Usuario creado correctamente" });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function updateUsuario(req, res) {
  const { id } = req.params;
  const { nombre, apellido, email } = req.body;

  if (!nombre || !apellido || !email) {
    return res.status(400).json({ message: "Faltan datos" });
  }

  try {
    const connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    await connection.execute(
      "UPDATE usuarios SET nombre = ?, apellido = ?, email = ? WHERE id = ?",
      [nombre, apellido, email, id]
    );

    res.json({ message: "Usuario actualizado correctamente" });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function deleteUsuario(req, res) {
  const { id } = req.params;

  try {
    const connection = await getConnection();
    const [result] = await connection.execute(
      "DELETE FROM usuarios WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ message: "Usuario eliminado correctamente" });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
