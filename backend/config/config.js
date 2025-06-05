export const config = {
  db: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "mi_base_de_datos",
    charset: "utf8mb4",
    environment: process.env.NODE_ENV || "development",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your_secret_key",
  },
  server: {
    port: process.env.PORT || 3000
  }
};