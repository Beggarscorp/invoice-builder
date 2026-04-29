import mysql from "mysql2/promise";

export async function connectDB() {
  const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "invoice_db", // ⚠️ CHECK THIS NAME
  });

  const [rows] = await db.execute("SELECT DATABASE() as db");
  console.log("CONNECTED DB:", rows);

  return db;
}