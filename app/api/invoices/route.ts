import { connectDB } from "@/lib/db";

export async function GET() {
  const db = await connectDB();

  const [rows]: any = await db.execute(
    "SELECT * FROM invoices ORDER BY id DESC"
  );

  return Response.json(rows);
}