import express from "express";
import { register, login, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.post("/logout", logout); 
// router.get("/protected", authMiddleware, (req, res) => {
//   res.json({ message: "Acceso autorizado", user: req.user });
// });

export default router;
