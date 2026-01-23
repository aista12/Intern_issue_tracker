import "dotenv/config";

import {Pool} from "pg";

const connectionString = process.env.DATABASE_URL;


if (!connectionString) {
    throw new Error("no db_url in env");
}

export const db = new Pool({
    connectionString,
});

console.log("DB URL =", process.env.DATABASE_URL);
