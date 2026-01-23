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