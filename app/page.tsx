"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { InvoiceData } from "@/types/invoice";

export default function Home() {
  const router = useRouter();

  const [form, setForm] = useState<InvoiceData>({
    invoiceNo: "",
    date: "",
    clientName: "",
    companyName: "",
    items: [{ description: "", amount: 0 }],
    discount: 0,
  });

  const handleItemChange = (index: number, field: any, value: string) => {
    const items = [...form.items];
    items[index] = {
      ...items[index],
      [field]: field === "amount" ? Number(value) : value,
    };
    setForm({ ...form, items });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: "", amount: 0 }],
    });
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/invoice", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();
    router.push(`/invoice/${data.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

        <h1 className="text-3xl font-bold mb-6 text-[#ef9815]">
          Create Invoice
        </h1>

        {/* Top Buttons */}
        <div className="flex justify-between mb-6">
          <button
            onClick={() => router.push("/invoices")}
            className="btn-primary"
          >
            View Invoices
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Invoice No"
            className="input"
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

          <input
            placeholder="Client Name"
            className="input col-span-2"
            onChange={(e) =>
              setForm({ ...form, clientName: e.target.value })
            }
          />

          <input
            placeholder="Company Name"
            className="input col-span-2"
            onChange={(e) =>
              setForm({ ...form, companyName: e.target.value })
            }
          />
        </div>

        {/* Items Section */}
        <h2 className="mt-8 font-bold text-xl">Items</h2>

        {form.items.map((item, i) => (
          <div key={i} className="grid grid-cols-2 gap-4 mt-3">
            <input
              placeholder="Description"
              className="input"
              onChange={(e) =>
                handleItemChange(i, "description", e.target.value)
              }
            />
            <input
              placeholder="Amount"
              type="number"
              className="input"
              onChange={(e) =>
                handleItemChange(i, "amount", e.target.value)
              }
            />
          </div>
        ))}

        <button onClick={addItem} className="btn-primary mt-4">
          + Add Item
        </button>

        {/* Discount */}
        <input
          placeholder="Discount"
          type="number"
          className="input mt-6"
          onChange={(e) =>
            setForm({ ...form, discount: Number(e.target.value) })
          }
        />

        {/* Submit */}
        <button onClick={handleSubmit} className="btn-primary mt-6 w-full">
          Save Invoice
        </button>
      </div>
    </div>
  );
}