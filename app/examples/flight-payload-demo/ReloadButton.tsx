"use client";

export function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      style={{
        padding: "0.75rem 1.5rem",
        backgroundColor: "#64748b",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 500
      }}
    >
      ページをリロード
    </button>
  );
}
