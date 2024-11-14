"use client";

import { Toaster as Toasty } from "sonner";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function useMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  return isMounted;
}

export default function Toaster() {
  const { theme } = useTheme();
  const isMounted = useMounted();

  if (isMounted && typeof theme === "string") {
    return (
      <Toasty
        richColors
        theme={theme as "light" | "dark" | "system" | undefined}
      />
    );
  }
}
