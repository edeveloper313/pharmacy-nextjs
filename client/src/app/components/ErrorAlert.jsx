
"use client";

import React, { useEffect, useState } from "react";
import { Alert } from "@mui/material";

const ErrorAlert = ({ message = "Something went wrong!" }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-[slideIn_0.4s_ease-out]">
      <Alert
        severity="error"
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

export default ErrorAlert;
