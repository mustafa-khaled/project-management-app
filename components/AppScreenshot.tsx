"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function AppScreenshot() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure that the component is mounted before using the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering if the component is not mounted yet (to prevent hydration mismatch)
  if (!mounted) return null;

  return (
    <div className="relative w-full max-w-[1200px] mx-auto mt-20">
      <div className="relative">
        <div className="relative bg-background/95 backdrop-blur rounded-lg shadow-2xl">
          <Image
            src={
              resolvedTheme === "dark"
                ? "/prello-dark.png"
                : "/prello-light.png"
            }
            alt="App preview"
            width={1824}
            height={1080}
            className="rounded-lg w-full"
            priority
          />

          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background"></div>
        </div>
      </div>
    </div>
  );
}
