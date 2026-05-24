import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    const db = await connectDB();

    // simple test query
    const [rows]: any = await db.execute("SELECT 1");

    return NextResponse.json({
      success: true,
      message: "Database connected successfully",
      rows,
    });

  } catch (error: any) {

    console.error("DB ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}