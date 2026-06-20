import React from "react";

export function StockBadge({ status, count }) {
  if (!status || status === "in") return null;

  const styles = {
    out: { background: "#FCEBEB", color: "#791F1F", text: "Out of stock" },
    low: { background: "#FAEEDA", color: "#633806", text: `Low stock${count ? ` · ${count}` : ""}` },
  };

  const { background, color, text } = styles[status];

  return (
    <span
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        background,
        color,
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: 6,
        whiteSpace: "nowrap",
      }}
    >
      {text}
    </span>
  );
}