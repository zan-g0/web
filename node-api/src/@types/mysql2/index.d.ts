// Type declarations for mysql2/promise to fix type compatibility issues

declare module 'mysql2/promise' {
  import mysql = require('mysql2');

  interface Connection extends mysql.Connection {
    execute<T = any>(sql: string, values?: any): Promise<[T, any]>;
    query<T = any>(sql: string, values?: any): Promise<[T, any]>;
  }

  interface Pool extends mysql.Pool {
    getConnection(): Promise<Connection>;
    query<T = any>(sql: string, values?: any): Promise<[T, any]>;
  }

  interface PoolCluster extends mysql.PoolCluster {
    getConnection(): Promise<Connection>;
    query<T = any>(sql: string, values?: any): Promise<[T, any]>;
  }

  function createPool(config: mysql.PoolConfig): Pool;
  function createPoolCluster(config?: mysql.PoolClusterConfig): PoolCluster;
}