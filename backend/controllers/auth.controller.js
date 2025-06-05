import jwt from "jsonwebtoken";
import { getConnection } from "../database/db.js";
import { hashPassword, verifyPassword } from "../utils/password.utils.js";
import { config } from "../config/config.js";

export async function register(req, res) {
  const { nombre, apellido, email, password, passwordConfirm } = req.body;
  if (
    !nombre ||
    !apellido ||
    !email ||
    !password ||
    !passwordConfirm
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son obligatorios" });
  }
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "Las contraseñas no coinciden" });
  }

  try {
    const connection = await getConnection();
    const [existingUser] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0)
      return res.status(400).json({ message: "El email ya está en uso" });

    const { salt, hash } = hashPassword(password);
    await connection.execute(
      "INSERT INTO usuarios (nombre, apellido, email, password, salt) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, email, hash, salt]
    );

    res.status(201).json({ message: "Usuario registrado correctamente" });
    await connection.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email y contraseña son obligatorios" });
  }

  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = rows[0];

    const isValid = verifyPassword(password, user.salt, user.password);
    if (!isValid) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: user.id }, config.jwt.secret, {
      expiresIn: "1h",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: config.environment === "production",
      sameSite: config.environment === "production" ? "None" : "Lax",
      maxAge: 60 * 60 * 1000,
    });

    // Eliminar campos sensibles antes de enviar el usuario
    const { password: _, salt, ...userSafe } = user;

    res.status(200).json({
      message: "Login exitoso",
      data: {
        // token,
        user: userSafe,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

export async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: config.environment === "production",
    sameSite: config.environment === "production" ? "None" : "Lax",
  });
  res.json({ message: "Sesión cerrada" });
}
