import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    const [rows]: any = await db.execute(
      "SELECT * FROM invoices ORDER BY id DESC"
    );

    return Response.json(rows);
  } catch (error: any) {
    console.error("FETCH ERROR:", error);

    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}