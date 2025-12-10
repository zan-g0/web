import mysql from 'mysql2/promise';

// 正确的MySQL2类型声明
interface Connection extends mysql.Connection {
  execute<T = any>(sql: string, values?: any): Promise<[T, any]>;
  query<T = any>(sql: string, values?: any): Promise<[T, any]>;
}

// 重写query方法的类型以兼容MySQL2的返回类型
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'web',
  waitForConnections: true,
  connectionLimit: 10
});

export default pool;