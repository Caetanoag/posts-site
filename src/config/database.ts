import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Pool } from "pg";

const env = dotenv.config();
dotenvExpand.expand(env);

export const pool = new Pool({
	connectionString: process.env.DATABASE_URL_LOCAL || process.env.DATABASE_URL,
});
