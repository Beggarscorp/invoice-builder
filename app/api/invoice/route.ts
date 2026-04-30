import { connectDB } from "@/lib/db";
import { generateInvoiceNumber } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      invoiceNo,
      date,
      clientName,
      companyName,
      items,
      discount,
    } = body;

    // Calculations (SAFE)
    const subtotal =
      items?.reduce(
        (sum: number, item: any) =>
          sum + (item.quantity || 0) * (item.price || 0),
        0
      ) || 0;

    const discountAmount = (subtotal * (discount || 0)) / 100;
    const finalTotal = subtotal - discountAmount;

    const db = await connectDB();

    const finalInvoiceNo = invoiceNo || generateInvoiceNumber();

    // INSERT INVOICE
    const [result]: any = await db.execute(
      `INSERT INTO invoices 
      (invoice_no, date, client_name, company_name, subtotal, discount, final_total)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        finalInvoiceNo || null,
        date || null,
        clientName || null,
        companyName || null,
        subtotal ?? 0,
        discount ?? 0,
        finalTotal ?? 0,
      ]
    );

    const invoiceId = result.insertId;

    // INSERT ITEMS
    for (const item of items || []) {
      await db.execute(
        `INSERT INTO invoice_items 
        (invoice_id, description, quantity, price)
        VALUES (?, ?, ?, ?)`,
        [
          invoiceId,
          item.description || "",
          item.quantity ?? 1,
          item.price ?? 0,
        ]
      );
    }

    return Response.json({ id: invoiceId });

  } catch (error: any) {
    console.error("API ERROR:", error);

    return Response.json(
      { error: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}