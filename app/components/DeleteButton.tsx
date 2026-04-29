"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this invoice?");

    if (!confirmDelete) return;

    try {
      const res = await fetch("/api/invoice/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json", // ✅ IMPORTANT
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      console.log("DELETE RESPONSE:", data);

      if (data.success) {
        alert("Invoice deleted successfully");
        router.refresh(); // refresh list
      } else {
        alert("Delete failed");
      }

    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 font-semibold hover:underline ml-3"
    >
      Delete
    </button>
  );
}