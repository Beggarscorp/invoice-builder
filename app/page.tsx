"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [form, setForm] = useState({
    invoiceNo: "",
    date: "",
    clientName: "",
    companyName: "",
    discount: 0,
    items: [{ description: "", quantity: 1, price: 0 }],
  });

  const [invoices, setInvoices] = useState<any[]>([]);

  // 🔹 LOAD ALL INVOICES
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const handleItemChange = (i: number, field: string, value: any) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, items });
  };

  // CALCULATIONS
  const subtotal = form.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const discountAmount = (subtotal * form.discount) / 100;
  const finalTotal = subtotal - discountAmount;

  // SUBMIT
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      // refresh list
      fetchInvoices();

      router.push(`/invoice/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Error saving invoice");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">

      {/* 🔥 CREATE FORM */}
      <div className="card p-6">
        <h1 className="text-3xl font-bold text-[#ef9815] mb-4">
          Create Invoice
        </h1>

        <input
          placeholder="Invoice No (optional)"
          className="input"
          onChange={(e) => setForm({ ...form, invoiceNo: e.target.value })}
        />

        <input
          type="date"
          className="input"
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <input
          placeholder="Client Name"
          className="input"
          onChange={(e) => setForm({ ...form, clientName: e.target.value })}
        />

        <input
          placeholder="Company Name"
          className="input"
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />

        <h2 className="font-bold mt-4">Items</h2>

        {form.items.map((item, i) => (
          <div key={i} className="grid grid-cols-3 gap-2">
            <input
              placeholder="Description"
              className="input"
              onChange={(e) =>
                handleItemChange(i, "description", e.target.value)
              }
            />
            <input
              type="number"
              placeholder="Qty"
              className="input"
              onChange={(e) =>
                handleItemChange(i, "quantity", Number(e.target.value))
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="input"
              onChange={(e) =>
                handleItemChange(i, "price", Number(e.target.value))
              }
            />
          </div>
        ))}

        <button onClick={addItem} className="btn-primary mt-2">
          + Add Item
        </button>

        <input
          type="number"
          placeholder="Discount (%)"
          className="input mt-4"
          onChange={(e) =>
            setForm({ ...form, discount: Number(e.target.value) })
          }
        />

        {/* PREVIEW */}
        <div className="card mt-6">
          <h2 className="font-bold text-xl mb-2">Preview</h2>

          {form.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.description} (x{item.quantity})
              </span>
              <span>₹ {item.quantity * item.price}</span>
            </div>
          ))}

          <hr className="my-2" />

          <p>Subtotal: ₹ {subtotal}</p>
          <p>Discount: ₹ {discountAmount}</p>
          <p className="font-bold">Total: ₹ {finalTotal}</p>
        </div>

        <button onClick={handleSubmit} className="btn-primary w-full mt-4">
          Save Invoice
        </button>
      </div>

      {/* 🔥 INVOICE LIST */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-4">All Invoices</h2>

        {invoices.length === 0 ? (
          <p className="text-gray-500">No invoices found</p>
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex justify-between items-center border p-3 rounded hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold">{inv.invoice_no}</p>
                  <p className="text-sm text-gray-500">
                    {inv.client_name}
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="font-bold">
                    ₹ {inv.final_total}
                  </span>

                  <button
                    onClick={() => router.push(`/invoice/${inv.id}`)}
                    className="text-[#ef9815] font-semibold"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}