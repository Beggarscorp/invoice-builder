import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const id = body?.id;

    // 🔥 DEBUG
    console.log("DELETE ID:", id);

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // delete items first
    await db.execute(
      "DELETE FROM invoice_items WHERE invoice_id=?",
      [id]
    );

    // delete invoice
    const [result]: any = await db.execute(
      "DELETE FROM invoices WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}