"use client";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-primary mt-6"
    >
      Print Invoice
    </button>
  );
}