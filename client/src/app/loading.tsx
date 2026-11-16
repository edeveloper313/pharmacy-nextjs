"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Loading = () => {
  const router = useRouter();
  useEffect(() => {router.prefetch("/authentication/sign-in");},[])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl font-bold">Loading...</h1>
    </div>
    
  );
};

export default Loading;