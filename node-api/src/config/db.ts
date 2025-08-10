import mysql from 'mysql2/promise';

// 扩展mysql2的类型声明
declare module 'mysql2/promise' {
  interface Connection {
    execute<T = any>(sql: string, values?: any): Promise<[T, any]>;
    query<T = any>(sql: string, values?: any): Promise<[T, any]>;
  }
}

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'web',
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;