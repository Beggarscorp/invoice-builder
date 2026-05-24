"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DeleteButton from "../components/DeleteButton";

export default function InvoicesPage() {

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH INVOICES
  const fetchInvoices = async () => {
    try {

      const res = await fetch("/api/invoices");

      const data = await res.json();

      console.log("API RESPONSE:", data);

      // ✅ VERY IMPORTANT
      if (Array.isArray(data)) {
        setRows(data);
      } else {
        setRows([]);
      }

    } catch (err) {
      console.error(err);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // DELETE UI UPDATE
  const handleDelete = (id: number) => {
    setRows((prev) => prev.filter((inv) => inv.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white p-8 rounded-2xl shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold text-[#ef9815]">
            All Invoices
          </h1>

          <Link href="/" className="btn-primary">
            + Create Invoice
          </Link>

        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full border rounded-lg overflow-hidden">

            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Invoice No</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>

              ) : rows.length === 0 ? (

                <tr>
                  <td
                    colSpan={4}
                    className="text-center p-6 text-gray-500"
                  >
                    No invoices found
                  </td>
                </tr>

              ) : (

                rows.map((inv: any) => (

                  <tr
                    key={inv.id}
                    className="border-t hover:bg-gray-50 transition"
                  >

                    <td className="p-3 font-medium">
                      {inv.invoice_no}
                    </td>

                    <td className="p-3">
                      {inv.client_name}
                    </td>

                    <td className="p-3 text-right font-semibold">
                      ₹ {inv.final_total}
                    </td>

                    <td className="p-3 text-center">

                      <Link
                        href={`/invoice/${inv.id}`}
                        className="text-[#ef9815] font-semibold hover:underline"
                      >
                        View
                      </Link>

                      <DeleteButton
                        id={inv.id}
                        onDelete={handleDelete}
                      />

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}