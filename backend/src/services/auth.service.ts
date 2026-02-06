import bcrypt from "bcrypt";
import { AuthRepository } from "../repositories/auth.repository";
import jwt from "jsonwebtoken";

export class AuthService {
    private users: AuthRepository;

    constructor(authRepository: AuthRepository) {
        this.users = authRepository;
    }

    async register(
        name: string,
        email: string,
        password: string,
    ): Promise<{ id: string; name: string; email: string }> {
        const existing = await this.users.findByEmail(email);
        if (existing) {
            throw new Error("invalid email or password");
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const user = await this.users.createUser({
            name,
            email,
            password_hash: passwordHash,
        });

        return { id: user.id, name: user.name, email: user.email };
    }

    async login(
        email: string,
        password: string,
    ): Promise<{
        token: string;
        user: { id: string; name: string; email: string };
    }> {
        const user = await this.users.findByEmail(email);
        if (!user) {
            throw new Error("invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash,
        );
        if (!isPasswordValid) {
            throw new Error("invalid email or password");
        }

        const token = jwt.sign(
            { sub: user.id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: process.env.JWT_EXPIRES_IN,
            } as jwt.SignOptions,
        );

        return {
            token,
            user: { id: user.id, name: user.name, email: user.email },
        };
    }
}
