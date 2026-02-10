import pg from "pg";
import type { Pool as PGPool, QueryResultRow } from "pg";
import { dbConfig } from "./dbConfig.js";

// PostgreSQL Database Pool
// - A pool of database connections

const { Pool } = pg;

export type TQueryRow<T extends QueryResultRow> = T;

const pool: PGPool = new Pool(dbConfig);

// Set timezone for all connections in the pool
pool.on("connect", async (client) => {
	const timezone = process.env.TZ || "America/Phoenix";
	await client.query(`SET timezone = '${timezone}'`);
});

// Log database connection errors (useful for production monitoring)
pool.on("error", (err) => {
	console.error("❌ Database connection error:", err);
});

// Test connection on startup
export async function testDatabaseConnection() {
	try {
		const result = await pool.query("SELECT NOW(), current_setting('timezone') as tz");
		console.log("✅ Database connected");
		console.log(`   Current time: ${result.rows[0].now}`);
		console.log(`   Timezone: ${result.rows[0].tz}`);
		return true;
	} catch (err: any) {
		console.error("❌ Database connection failed:", err.message);
		return false;
	}
}

export default pool;
