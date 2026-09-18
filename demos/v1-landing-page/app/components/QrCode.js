"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

// Renders a real, scannable QR as inline SVG. In the demo it encodes the
// ticket's /t/<code> URL — the same thing the door scanner would read.
export default function QrCode({ value, size = 160, label }) {
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, {
      type: "svg",
      margin: 1,
      color: { dark: "#0b0b10", light: "#ffffff" },
    }).then((s) => {
      if (!cancelled) setSvg(s);
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div
      className="qr"
      style={{ width: size, height: size }}
      role="img"
      aria-label={label || `QR code for ${value}`}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
