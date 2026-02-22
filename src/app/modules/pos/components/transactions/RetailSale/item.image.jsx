import React, { useState } from "react";

export function ItemImage({ src, name, height }) {
  const [error, setError] = useState(false);

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .trim()
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const getColorFromName = (name) => {
    const colors = [
      "#0ea5e9", // sky blue
      "#6366f1", // indigo
      "#8b5cf6", // violet
      "#ec4899", // pink
      "#f97316", // orange
      "#eab308", // yellow
      "#22c55e", // green
      "#ef4444", // red
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (error || !src) {
    return (
      <div
        className="image product-img"
        style={{
          minHeight: height,
          maxHeight: height,
          background: getColorFromName(name)
        }}
      >
        <div
          className="image-fallback"
        >
          {getInitials(name)}
        </div>
      </div>
    );
  }

  return (
    <div
      className="image product-img"
      style={{ minHeight: height, maxHeight: height}}
    >
      <img
        src={src}
        alt={name}
        onError={() => setError(true)}
      />
    </div>
  );
}
