"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertColor } from "@mui/material"; // AlertColor import kiya

// 1. TypeScript Props Interface
interface AlertProps {
  message?: string;
  type?: AlertColor; // 'success' | 'error' | 'warning' | 'info' types allow karega
}

// 2. Component mein 'type' prop receive kiya (default "success")
const SuccessAlert = ({ 
  message = "Successfully completed!", 
  type = "success" 
}: AlertProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true); // Agar naya message aaye toh dobara show ho
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000); // 2 seconds

    return () => clearTimeout(timer);
  }, [message, type]); // Dependency array mein message aur type add kiya

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-[slideIn_0.4s_ease-out]">
      <Alert
        severity={type} // Yahan 'type' prop use ho raha hai
        variant="filled"
        className="!rounded-lg !shadow-xl"
      >
        {message}
      </Alert>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessAlert;