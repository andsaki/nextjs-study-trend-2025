"use client";

import { useState, useEffect } from "react";

// Client Component - ブラウザで実行される
export function ClientComponent() {
  const [count, setCount] = useState(0);
  const [clientTime, setClientTime] = useState("");

  useEffect(() => {
    setClientTime(new Date().toISOString());
  }, []);

  return (
    <div style={{
      padding: "1rem",
      border: "2px solid #10b981",
      borderRadius: "8px",
      backgroundColor: "#ecfdf5"
    }}>
      <h3 style={{ color: "#047857", margin: 0, marginBottom: "0.5rem" }}>
        🟢 Client Component
      </h3>
      <p style={{ margin: "0.5rem 0" }}>
        <strong>マウント時刻:</strong> {clientTime}
      </p>
      <p style={{ margin: "0.5rem 0" }}>
        <strong>カウント:</strong> {count}
      </p>
      <button
        onClick={() => setCount(c => c + 1)}
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#10b981",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: 500
        }}
      >
        カウント +1
      </button>
      <p style={{
        fontSize: "0.875rem",
        color: "#64748b",
        marginTop: "1rem",
        padding: "0.5rem",
        backgroundColor: "white",
        borderRadius: "4px"
      }}>
        💡 このコンポーネントはブラウザで実行され、<br/>
        インタラクティブな機能を提供します。
      </p>
    </div>
  );
}
