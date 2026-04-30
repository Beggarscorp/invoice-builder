export const dynamic = "force-dynamic";

import { connectDB } from "@/lib/db";
import PrintButton from "../../components/PrintButton";

export default async function InvoicePage({ params }: any) {
  const { id } = await params;

  const db = await connectDB();

  const [invoice]: any = await db.execute(
    "SELECT * FROM invoices WHERE id=?",
    [id]
  );

  const [items]: any = await db.execute(
    "SELECT * FROM invoice_items WHERE invoice_id=?",
    [id]
  );

  if (!invoice.length) {
    return <div className="p-10 text-red-500">Invalid Invoice</div>;
  }

  const inv = invoice[0];

  return (
    <div className="bg-gray-200 min-h-screen p-4 print:bg-white">

      <div className="max-w-4xl mx-auto bg-white p-6 shadow print:shadow-none print-container compact">

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold tracking-wide">PAYMENT</h1>

            <p className="text-xs mt-1">NO: {inv.invoice_no}</p>
            <p className="text-xs">DATE: {inv.date}</p>

            <div className="h-1 w-24 bg-green-400 mt-2"></div>
          </div>

          <img src="/logo.png" className="w-16 h-16" />
        </div>

        {/* CLIENT */}
        <div className="grid grid-cols-2 mt-4 text-sm">
          <div>
            <p className="text-gray-500">TO:</p>
            <p className="font-semibold">{inv.client_name}</p>
          </div>

          <div className="text-right">
            <p className="text-gray-500">COMPANY:</p>
            <p className="font-semibold">{inv.company_name}</p>
          </div>
        </div>

        {/* ITEMS TABLE */}
        <div className="mt-4">

          <div className="grid grid-cols-4 text-xs font-bold border-b pb-1">
            <span>Description</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Amount</span>
          </div>

          {items.map((item: any) => (
            <div key={item.id} className="grid grid-cols-4 text-xs py-1">

              <span>{item.description}</span>

              <span className="text-center">
                {item.quantity}
              </span>

              <span className="text-right">
                ₹ {item.price}
              </span>

              <span className="text-right">
                ₹ {(item.quantity * item.price).toFixed(2)}
              </span>

            </div>
          ))}

        </div>

        {/* TOTAL */}
        <div className="mt-4 flex justify-end">
          <div className="w-52 text-xs">

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹ {inv.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>
              <span>₹ {inv.discount}</span>
            </div>

            <hr className="my-1" />

            <div className="flex justify-between font-bold text-sm">
              <span>Total</span>
              <span>₹ {inv.final_total}</span>
            </div>

          </div>
        </div>

        {/* PAYMENT */}
        <div className="mt-3 text-xs">
          <p className="font-bold">PAYMENT METHOD</p>
          <p>Cash / Online</p>
        </div>

        {/* BANK */}
        <div className="grid grid-cols-2 mt-4 text-xs no-break">

          <div>
            <p><b>A/c Holder:</b> Humanomics Pvt Ltd</p>
            <p><b>A/c:</b> 386905001972</p>
            <p><b>IFSC:</b> ICIC0003869</p>
            <p>ICICI Bank, Varanasi</p>
          </div>

          <div className="text-right">
            <p className="font-bold">RECEIVED BY</p>

            <div className="mt-6 border-t w-28 ml-auto"></div>

            <p className="text-[10px] mt-1">Signature</p>
          </div>

        </div>

        {/* PRINT BUTTON */}
        <div className="mt-4 print:hidden">
          <PrintButton />
        </div>

      </div>
    </div>
  );
}