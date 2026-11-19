
"use client";

import React, { useEffect, useRef, useState } from "react";
import { Alert as MuiAlert, AlertColor } from "@mui/material";

interface AlertProps {
  message: string;
  type: AlertColor;
}

const Alert = ({ message, type }: AlertProps) => {
  const [show, setShow] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    setShow(true);
    startTimer();

    return () => pauseTimer();
  }, [message, type]);

  if (!show) return null;

  return (
    <div
      className="fixed top-5 right-5 z-[9999] animate-[slideIn_0.4s_ease-out]"
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
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
