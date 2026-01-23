import { AuthService } from "../services/auth.service";
import { Request, Response } from "express";

export class AuthController {
    private authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
    }

    register = async (req: Request, res: Response) => {
        const { name, email, password } = req.body;
        console.log("REGISTER BODY:", req.body);


        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                error: {
                    message: "name, email, password are required",
                },
            });
        }

        try {
            const user = await this.authService.register(
                name,
                email,
                password,
            );
            console.log("registered user:", user);
            return res.status(201).json(user);
        } catch (e: any) {
            console.error("error in register:", e);
            return res
                .status(400)
                .json({ error: { message: e.message } });
        }
    };

    login = async (req: Request, res: Response) => {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                error: {
                    message: "email and password are required",
                },
            });
        }

        try {
            const result = await this.authService.login(
                email,
                password,
            );
            return res.status(200).json(result);
        } catch (e: any) {
            const msg = e?.message ?? "Error";
            const status = msg.includes("invalid email or password")
                ? 401
                : 400;
            return res
                .status(status)
                .json({ error: { message: msg } });
        }
    };
}
