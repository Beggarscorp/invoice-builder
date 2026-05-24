import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const db = await connectDB();

    const [rows]: any = await db.execute(
      "SELECT * FROM invoices ORDER BY id DESC"
    );

    return NextResponse.json(rows);

  } catch (error: any) {

    console.error(error);

    return NextResponse.json([]);

  }
}