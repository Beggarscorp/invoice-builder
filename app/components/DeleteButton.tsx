"use client";

export default function DeleteButton({ id, onDelete }: any) {

  const handleDelete = async () => {
    if (!confirm("Delete this invoice?")) return;

    try {
      const res = await fetch(`/api/invoice/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Delete failed");
      }

      onDelete(id); // update UI

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <button onClick={handleDelete} className="text-red-500 ml-3">
      Delete
    </button>
  );
}