"use client";

export default function DeleteButton({ id, onDelete }: any) {
  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this invoice?");

    if (!confirmDelete) return;

    await fetch(`/api/invoice/${id}`, {
      method: "DELETE",
    });

    // 🔥 notify parent
    onDelete(id);
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-500 ml-3 font-semibold"
    >
      Delete
    </button>
  );
}