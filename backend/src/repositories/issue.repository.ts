import { db } from "../db/db";
import { Issue, IssueWithLabels, IssueRow, Label, IssueDetailRow } from "../types";

export class IssueRepository {
    async createIssue(issue: Issue): Promise<IssueWithLabels> {
        const { rows } = await db.query<IssueWithLabels>(
            `
            INSERT INTO issues (title, description, status, priority, created_by_id)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING issue_no, id, title, description, status, priority, created_by_id,
            '[]'::json AS labels
            `,
            [
            issue.title,
            issue.description ?? null,
            issue.status,
            issue.priority,
            issue.created_by.id,
            ]
        );
        return rows[0];
    }




//     async findAll(opts: {
//         page: number;
//         limit: number;
//         status?: string;
//         search?: string;
//         labelId?: string;
//         }): Promise<IssueRow[]> {
//         let query = `
//             SELECT i.issue_no, i.id, i.title, i.description, i.status, i.priority, i.created_by_id
//             FROM issues i
//         `;


//         if (opts.labelId) {
//             query += `
//             JOIN issue_labels il ON il.issue_id = i.id
//             `;
//         }

//         query += ` WHERE 1=1 `;
//         const params: any[] = [];

//         if (opts.status) {
//             params.push(opts.status);
//             query += ` AND i.status = $${params.length}`;
//         }

//         if (opts.search) {
//             params.push(`%${opts.search}%`);
//             query += ` AND i.title ILIKE $${params.length}`;
//         }

//         if (opts.labelId) {
//             params.push(opts.labelId);
//             query += ` AND il.label_id = $${params.length}`;
//         }

//         query += ` ORDER BY i.issue_no DESC`;

//         params.push(opts.limit);
//         params.push((opts.page - 1) * opts.limit);

//         query += ` LIMIT $${params.length - 1} OFFSET $${params.length}`;

//         const { rows } = await db.query<IssueRow>(query, params);
//         return rows;
// }

    async findAll(opts: {
        page: number;
        limit: number;
        status?: string;
        search?: string;
        labelId?: string;
        }): Promise<IssueWithLabels[]> {
        const params: any[] = [];
        let where = ` WHERE 1=1 `;
        let labelFilterJoin = "";
        let labelFilterWhere = "";

        if (opts.status) {
            params.push(opts.status);
            where += ` AND i.status = $${params.length}`;
        }

        if (opts.search) {
            params.push(`%${opts.search}%`);
            where += ` AND i.title ILIKE $${params.length}`;
        }

        //filter by label WITHOUT affecting returned labels list
        if (opts.labelId) {
            labelFilterJoin = ` JOIN issue_labels fil ON fil.issue_id = i.id `;
            params.push(opts.labelId);
            labelFilterWhere = ` AND fil.label_id = $${params.length}`;
        }

        params.push(opts.limit);
        const limitIdx = params.length;
        params.push((opts.page - 1) * opts.limit);
        const offsetIdx = params.length;

        const sql = `
            WITH base AS (
            SELECT i.issue_no, i.id, i.title, i.description, i.status, i.priority, i.created_by_id
            FROM issues i
            ${labelFilterJoin}
            ${where}
            ${labelFilterWhere}
            ORDER BY i.issue_no DESC
            LIMIT $${limitIdx} OFFSET $${offsetIdx}
            )
            SELECT
            b.issue_no, b.id, b.title, b.description, b.status, b.priority, b.created_by_id,
            COALESCE(
                json_agg(
                json_build_object('id', l.id, 'name', l.name, 'color', l.color)
                ) FILTER (WHERE l.id IS NOT NULL),
                '[]'
            ) AS labels
            FROM base b
            LEFT JOIN issue_labels il ON il.issue_id = b.id
            LEFT JOIN labels l ON l.id = il.label_id
            GROUP BY b.issue_no, b.id, b.title, b.description, b.status, b.priority, b.created_by_id
            ORDER BY b.issue_no DESC
        `;

        const { rows } = await db.query<IssueWithLabels>(sql, params);
        return rows;
        }


    // async findById(id: string): Promise<IssueWithLabels | null> {
    //     const { rows } = await db.query<IssueWithLabels>(
    //         `
    //       SELECT i.issue_no, i.id, i.title, i.description, i.status, i.priority, i.created_by_id
    //       FROM issues i
    //       WHERE i.id = $1
    //     `,
    //         [id],
    //     );
    //     return rows[0] ?? null;
    // }

    async findById(id: string): Promise<IssueDetailRow | null> {
        const { rows } = await db.query<IssueDetailRow>(
            `
            SELECT
            i.issue_no, i.id, i.title, i.description, i.status, i.priority, i.created_by_id,
            u.name AS created_by_name,
            u.email AS created_by_email,
            COALESCE(
                json_agg(
                json_build_object('id', l.id, 'name', l.name, 'color', l.color)
                ) FILTER (WHERE l.id IS NOT NULL),
                '[]'
            ) AS labels
            FROM issues i
            JOIN users u ON u.id = i.created_by_id
            LEFT JOIN issue_labels il ON il.issue_id = i.id
            LEFT JOIN labels l ON l.id = il.label_id
            WHERE i.id = $1
            GROUP BY i.issue_no, i.id, i.title, i.description, i.status, i.priority, i.created_by_id,
            u.name, u.email
            `,
            [id]
        );
        return rows[0] ?? null;
    }


    async deleteById(issueId: string, userId:string ): Promise<number> {
        const {rowCount} = await db.query(`DELETE FROM issues WHERE id= $1 AND created_by_id = $2`, 
            [issueId, userId]);
        return rowCount ?? 0;
    }

    async addLabels(
        issueId: string,
        labelIds: string[],
    ): Promise<void> {
        for (const labelId of labelIds) {
            await db.query(
                `INSERT INTO issue_labels (issue_id, label_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [issueId, labelId],
            );
        }
    }

    async removeLabels(
        issueId: string,
        labelIds: string[],
    ): Promise<void> {
        for (const labelId of labelIds) {
            await db.query(
                `DELETE FROM issue_labels WHERE issue_id = $1 AND label_id = $2`,
                [issueId, labelId],
            );
        }
    }

    async updateStatus(id: string, status: string): Promise<void> {
        await db.query(
            `UPDATE issues SET status = $1 WHERE id = $2`,
            [status, id],
        );
    }

    async updatePriority(
        id: string,
        priority: string,
    ): Promise<void> {
        await db.query(
            `UPDATE issues SET priority = $1 WHERE id = $2`,
            [priority, id],
        );
    }

    async updateDescription(
        id: string,
        description: string,
    ): Promise<void> {
        await db.query(
            `UPDATE issues SET description = $1 WHERE id = $2`,
            [description, id],
        );
    }

    async updateTitle(id: string, title: string): Promise<void> {
        await db.query(`UPDATE issues SET title = $1 WHERE id = $2`, [
            title,
            id,
        ]);
    }


    async findLabelsByIssueId(issueId: string): Promise<Label[]> {
        const { rows } = await db.query<Label>(
        `
        SELECT l.id, l.name, l.color
        FROM issue_labels il
        JOIN labels l ON l.id = il.label_id
        WHERE il.issue_id = $1
        ORDER BY l.name ASC
        `,
        [issueId]
        );
        return rows;
  }
}
