"use client";

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function BarcodeScanner({ onScanned }) {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 300, height: 150 },
      formatsToSupport: ["EAN_13", "UPC_A", "UPC_E", "CODE_128", "QR_CODE"],
    });

    scanner.render(
      (decodedText) => {
        onScanned(decodedText);
        scanner.clear();
      },
      (error) => {
        // Scan errors are expected and ignored
      }
    );

    return () => {
      scanner.clear().catch(console.error);
    };
  }, [onScanned]);

  return <div id="reader" className="w-full mt-2" />;
}
