import { connectDB } from "@/lib/db";
import PrintButton from "../../components/PrintButton";

export default async function InvoicePage({ params }: any) {
  const resolvedParams = await params;
  const id = resolvedParams?.id;

  if (!id) {
    return <div className="p-10 text-red-500">Invalid ID</div>;
  }

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
    return <div className="p-10 text-red-500">Invoice not found</div>;
  }

  const data = invoice[0];

  return (
    <div className="bg-white p-10 text-gray-800 print:p-0">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <h1 className="text-4xl font-bold tracking-widest mb-4">
          PAYMENT
        </h1>

        <div className="flex justify-between text-sm mb-6">
          <div>
            <p>NO: {data.invoice_no}</p>
            <p>DATE: {data.date}</p>
          </div>

          <div className="text-right">
            <p className="text-gray-500">COMPANY:</p>
            <p className="font-semibold">{data.company_name}</p>
          </div>
        </div>

        {/* CLIENT */}
        <div className="mb-6">
          <p className="text-gray-500 text-sm">TO:</p>
          <p className="font-semibold">{data.client_name}</p>
        </div>

        {/* TABLE */}
        <div className="mt-6">
          <div className="flex justify-between text-gray-500 text-sm mb-2">
            <span>DESCRIPTION</span>
            <span>AMOUNT</span>
          </div>

          {items.map((item: any) => (
            <div
              key={item.id}
              className="flex justify-between py-1"
            >
              <span>{item.description}</span>
              <span>INR {item.amount}</span>
            </div>
          ))}
        </div>

        {/* TOTAL BOX */}
        <div className="mt-6 border rounded-lg p-4">
          <div className="flex justify-between">
            <span>TOTAL</span>
            <span>INR {data.total}</span>
          </div>

          <div className="flex justify-between text-gray-500">
            <span>CONCESSION</span>
            <span>- INR {data.discount}</span>
          </div>

          <div className="flex justify-between font-bold text-lg mt-2">
            <span>TOTAL</span>
            <span>INR {data.final_total}</span>
          </div>
        </div>

        {/* AMOUNT IN WORDS */}
        <p className="mt-4 text-sm italic text-center">
          Amount in words (add converter later)
        </p>

        {/* PAYMENT METHOD */}
        <div className="mt-6 text-sm">
          <p className="font-semibold">PAYMENT METHOD</p>
          <p>Cash / Online</p>
        </div>

        {/* BANK DETAILS */}
        <div className="mt-6 text-sm">
          <p>A/c Holder Name: {data.company_name}</p>
          <p>A/c No: XXXXXXXX</p>
          <p>(Account Type: Current Account)</p>
          <p>IFSC: XXXXXXXX</p>
          <p className="font-semibold">ICICI Bank, Varanasi</p>
        </div>

        {/* SIGNATURE */}
        <div className="mt-16 flex justify-between">
          <div></div>

          <div className="text-center">
            <p className="text-sm">RECEIVED BY</p>
            <div className="border-t mt-6 w-40"></div>
            <p className="text-xs mt-1">Signature & Date</p>
          </div>
        </div>

        {/* PRINT BUTTON */}
        <div className="print:hidden mt-10">
          <PrintButton />
        </div>

      </div>
    </div>
  );
}