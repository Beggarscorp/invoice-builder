"use client";

import { useState } from "react";
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

  // ➕ ADD ITEM
  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  // ❌ REMOVE ITEM
  const removeItem = (index: number) => {
    if (form.items.length === 1) return; // prevent removing last item

    const updated = form.items.filter((_, i) => i !== index);
    setForm({ ...form, items: updated });
  };

  // ✏️ UPDATE ITEM
  const handleItemChange = (i: number, field: string, value: any) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, items });
  };

  // 💰 CALCULATIONS
  const subtotal = form.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const discountAmount = (subtotal * form.discount) / 100;
  const finalTotal = subtotal - discountAmount;

  // 🚀 SUBMIT
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

      router.push(`/invoice/${data.id}`);
    } catch (err) {
      console.error(err);
      alert("Error saving invoice");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-[#ef9815]">
          Create Invoice
        </h1>

        <button
          onClick={() => router.push("/invoices")}
          className="btn-primary"
        >
          All Invoices
        </button>
      </div>

      {/* 🔥 FORM CARD */}
      <div className="card p-6 space-y-4">

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

        {/* 🧾 ITEMS */}
        <h2 className="font-bold mt-4">Items</h2>

        {form.items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-2 items-center"
          >
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

            {/* ❌ REMOVE BUTTON */}
            <button
                onClick={() => removeItem(i)}
                disabled={form.items.length === 1}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-400 transition disabled:opacity-40"
              >
                ✕
              </button>
          </div>
        ))}

        <button onClick={addItem} className="btn-primary mt-2">
          + Add Item
        </button>

        {/* 💸 DISCOUNT */}
        <input
          type="number"
          placeholder="Discount (%)"
          className="input mt-4"
          onChange={(e) =>
            setForm({ ...form, discount: Number(e.target.value) })
          }
        />

        {/* 📊 PREVIEW */}
        <div className="card mt-6">
          <h2 className="font-bold text-xl mb-2">Preview</h2>

          {form.items.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.description || "Item"} (x{item.quantity})
              </span>
              <span>₹ {item.quantity * item.price}</span>
            </div>
          ))}

          <hr className="my-2" />

          <p>Subtotal: ₹ {subtotal}</p>
          <p>Discount: ₹ {discountAmount}</p>
          <p className="font-bold text-lg">Total: ₹ {finalTotal}</p>
        </div>

        {/* 🚀 SAVE BUTTON */}
        <button onClick={handleSubmit} className="btn-primary w-full mt-4">
          Save Invoice
        </button>

      </div>
    </div>
  );
}