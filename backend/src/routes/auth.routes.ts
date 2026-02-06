/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string, example: "Sav" }
 *               email: { type: string, example: "sav@mail.com" }
 *               password: { type: string, example: "Password123!" }
 *     responses:
 *       201:
 *         description: Registered
 *       400:
 *         description: Validation error
 */


import { Router } from "express";
import { AuthRepository } from "../repositories/auth.repository";
import { AuthController } from "../controllers/auth.controller";
import { AuthService } from "../services/auth.service";

const router = Router();

const authRepository = new AuthRepository();
const authService = new AuthService(authRepository);
const authController = new AuthController(authService);


router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;