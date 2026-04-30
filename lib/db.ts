// lib/db.ts
import mysql from 'mysql2/promise';

export async function connectDB() {
  if (
    process.env.DB_HOST === undefined ||
    process.env.DB_USER === undefined ||
    process.env.DB_PASSWORD === undefined
  ) {
    throw new Error(
      `Missing DB env vars — DB_HOST: ${process.env.DB_HOST}, DB_USER: ${process.env.DB_USER}`
    );
  }

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    return connection;
  } catch (err) {
    throw new Error(`DB connection failed: ${(err as Error).message}`);
  }
}