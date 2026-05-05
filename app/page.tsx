"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const generateInvoiceNo = () => {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `BC/${year}/${rand}`;
  };

  const [form, setForm] = useState({
    invoiceNo: generateInvoiceNo(),
    date: "",
    clientName: "",
    companyName: "Beggars Corporation", // ✅ DEFAULT COMPANY
    discount: 0,
    gst: 18,
    items: [{ description: "", quantity: 1, price: 0 }],
  });

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index: number) => {
    if (form.items.length === 1) return;
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (i: number, field: string, value: any) => {
    const items = [...form.items];
    items[i] = { ...items[i], [field]: value };
    setForm({ ...form, items });
  };

  const subtotal = form.items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const discountAmount = (subtotal * form.discount) / 100;
  const taxable = subtotal - discountAmount;
  const gstAmount = (taxable * form.gst) / 100;
  const finalTotal = taxable + gstAmount;

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          subtotal,
          finalTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      router.push(`/invoice/${data.id}`);
    } catch (err) {
      alert("Error saving invoice");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">

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

      <div className="card p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4">
          <input
            className="input"
            value={form.invoiceNo}
            onChange={(e) =>
              setForm({ ...form, invoiceNo: e.target.value })
            }
          />

          <input
            type="date"
            className="input"
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Client Name"
            className="input"
            onChange={(e) =>
              setForm({ ...form, clientName: e.target.value })
            }
          />

          <input
            className="input"
            value={form.companyName} // ✅ AUTO FILLED
            onChange={(e) =>
              setForm({ ...form, companyName: e.target.value })
            }
          />
        </div>

        {/* ITEMS */}
        <div>
          <h2 className="font-semibold text-lg mb-3">Items</h2>

          <div className="grid grid-cols-[3fr_1fr_1fr_1fr_auto] text-sm text-gray-500 px-2 mb-2">
            <span>Description</span>
            <span>Qty</span>
            <span>Price</span>
            <span className="text-right">Total</span>
            <span></span>
          </div>

          <div className="space-y-2">
            {form.items.map((item, i) => {
              const total = item.quantity * item.price;

              return (
                <div
                  key={i}
                  className="grid grid-cols-[3fr_1fr_1fr_1fr_auto] gap-2 items-center bg-gray-50 p-2 rounded-lg"
                >
                  <input
                    className="input bg-white"
                    placeholder="Item name"
                    onChange={(e) =>
                      handleItemChange(i, "description", e.target.value)
                    }
                  />

                  <input
                    type="number"
                    className="input bg-white text-center"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(i, "quantity", Number(e.target.value))
                    }
                  />

                  <input
                    type="number"
                    className="input bg-white text-center"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(i, "price", Number(e.target.value))
                    }
                  />

                  <div className="text-right font-semibold">
                    ₹ {total}
                  </div>

                  <button
                    onClick={() => removeItem(i)}
                    className="w-8 h-8 flex items-center justify-center rounded-md border hover:bg-red-50 text-gray-500 hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <button onClick={addItem} className="btn-primary mt-3">
            + Add Item
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Discount (%)"
            className="input"
            onChange={(e) =>
              setForm({ ...form, discount: Number(e.target.value) })
            }
          />

          <input
            type="number"
            placeholder="GST (%)"
            className="input"
            value={form.gst}
            onChange={(e) =>
              setForm({ ...form, gst: Number(e.target.value) })
            }
          />
        </div>

        <div className="text-right space-y-1">
          <p>Subtotal: ₹ {subtotal}</p>
          <p>Discount: ₹ {discountAmount}</p>
          <p>GST: ₹ {gstAmount}</p>
          <p className="text-lg font-bold">Total: ₹ {finalTotal}</p>
        </div>

        <button onClick={handleSubmit} className="btn-primary w-full">
          Save Invoice
        </button>

      </div>
    </div>
  );
}