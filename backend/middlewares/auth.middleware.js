import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

function verifyTokenAsync(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwt.secret, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });
}

export async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // Primero, intentamos obtener token desde cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      // console.log("🔐 Token obtenido de cookie");
    }
    // Si no hay cookie, buscamos en Authorization header (por compatibilidad)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
      // console.log("🔐 Token obtenido de header Authorization");
    }
    // Si no, intentamos en query param (menos recomendable)
    else if (req.query.token) {
      token = req.query.token;
      // console.log("🔐 Token obtenido por query param");
    }

    if (!token) {
      return res.status(401).json({
        message:
          "No autorizado: Token no proporcionado. Asegúrate de haber iniciado sesión correctamente.",
      });
    }

    const decoded = await verifyTokenAsync(token);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("🚫 Error en authMiddleware:", error.message);
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}
