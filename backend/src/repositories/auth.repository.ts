import { db } from "../db/db";
import { User } from "../types";

export class AuthRepository {
    async findByEmail(email: string): Promise<User | null> {
        const { rows } = await db.query<User>(
            `SELECT id, name, email, password_hash FROM users WHERE email = $1`,
            [email],
        );
        return rows[0] ?? null;
    }

    async createUser(input: { name: string; email: string; password_hash: string }): Promise<User> {
        const {rows} = await db.query<User>(
            `INSERT INTO users ( name, email, password_hash) VALUES ($1, $2, $3)  RETURNING id, name, email, password_hash`,
            [input.name, input.email, input.password_hash],
        );
        return rows[0];
    }
}