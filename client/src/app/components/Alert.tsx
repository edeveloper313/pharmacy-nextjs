
"use client";

import React, { useEffect, useState } from "react";
import { Alert as MuiAlert, AlertColor } from "@mui/material";

interface AlertProps{
  message: string;
  type: AlertColor;
}

const Alert = ({ message, type }: AlertProps) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, type]);

  if (!show) return null;

  return (
    <div className="fixed top-5 right-5 z-[9999] animate-[slideIn_0.4s_ease-out]">
      <MuiAlert
        severity={type}
        variant="filled"
        className="!rounded-lg !shadow-xl"
      >
        {message}
      </MuiAlert>

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

export default Alert;
