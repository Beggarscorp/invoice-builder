import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { InvoiceData } from "@/types/invoice";

export async function POST(req: Request) {
  const body: InvoiceData = await req.json();
  const db = await connectDB();

  const total = body.items.reduce((sum, i) => sum + Number(i.amount), 0);
  const finalTotal = total - Number(body.discount);

  const [result]: any = await db.execute(
    "INSERT INTO invoices (invoice_no, date, client_name, company_name, total, discount, final_total) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      body.invoiceNo,
      body.date,
      body.clientName,
      body.companyName,
      total,
      body.discount,
      finalTotal,
    ]
  );

  const invoiceId = result.insertId;

  for (let item of body.items) {
    await db.execute(
      "INSERT INTO invoice_items (invoice_id, description, amount) VALUES (?, ?, ?)",
      [invoiceId, item.description, item.amount]
    );
  }

  return NextResponse.json({ id: invoiceId });
}