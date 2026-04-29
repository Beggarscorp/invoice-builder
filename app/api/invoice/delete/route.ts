import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    console.log("DELETE ID:", id);

    const db = await connectDB();

    await db.execute("DELETE FROM invoice_items WHERE invoice_id=?", [id]);
    await db.execute("DELETE FROM invoices WHERE id=?", [id]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("API DELETE ERROR:", error);
    return NextResponse.json({ success: false });
  }
}