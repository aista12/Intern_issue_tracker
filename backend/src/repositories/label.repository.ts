import {db} from "../db/db";
import { Label } from "../types";


export class LabelRepository {
    async findAll(): Promise<Label[]> {
        const { rows } = await db.query<Label>(`SELECT id, name, color FROM labels`);
        return rows;
    }


    async createLabel(name: string, color: string): Promise<Label> {
        const { rows } = await db.query<Label>(
            `INSERT INTO labels (name, color) VALUES ($1, $2) RETURNING id, name, color`,
            [name, color]
        );
        return rows[0];
    }

    async getUsageCount(id: string): Promise<number> {
        const { rows } = await db.query(
            `SELECT COUNT(*)::text AS count FROM issue_labels WHERE label_id = $1 `,
            [id]
        )
        return Number(rows[0].count ?? 0);
    }

   


    async deleteById(id: string): Promise<void> {
        await db.query(`DELETE FROM labels WHERE id = $1`, [id]);
    }
}