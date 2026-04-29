import mysql from "mysql2/promise";

export async function connectDB() {
  const url = process.env.DATABASE_URL;

  // console.log("DATABASE_URL:", url); // 👈 debug

  if (!url) {
    throw new Error("DATABASE_URL not found");
  }

  return await mysql.createConnection(url);
}