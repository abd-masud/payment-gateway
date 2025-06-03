import { Pool, PoolClient, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;
let lastConnectionAttempt: number | null = null;

function createNewPool(): Pool {
    return new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        max: 10,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 10000,
    });
}

export async function connectionToDatabase(): Promise<Pool> {
    // Test existing pool if it exists
    if (pool) {
        try {
            const client = await pool.connect();
            await client.query('SELECT 1');
            client.release();
            return pool;
        } catch {
            pool = null;
        }
    }

    // Rate limit connection attempts
    const now = Date.now();
    if (lastConnectionAttempt && (now - lastConnectionAttempt) < 5000) {
        throw new Error('Too frequent connection attempts');
    }
    lastConnectionAttempt = now;

    // Create new pool
    try {
        pool = createNewPool();
        const client = await pool.connect();
        client.release();
        return pool;
    } catch {
        throw new Error('Database connection failed');
    }
}

export async function runQuery<T extends QueryResultRow = QueryResultRow>(
    query: string,
    params: unknown[] = []
): Promise<T[]> {
    let client: PoolClient | undefined;
    try {
        const pool = await connectionToDatabase();
        client = await pool.connect();
        const result: QueryResult<T> = await client.query<T>(query, params);
        return result.rows;
    } catch (error) {
        throw error;
    } finally {
        if (client) {
            try {
                client.release();
            } catch (error) {
                console.error('Error releasing connection:', error);
            }
        }
    }
}

// Cleanup on process termination
process.on('SIGINT', async () => {
    if (pool) {
        try {
            await pool.end();
        } catch (error) {
            console.error('Error closing connection pool:', error);
        }
    }
    process.exit(0);
});