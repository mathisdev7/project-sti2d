"use client";
import "aos/dist/aos.css";
import { useSession } from "next-auth/react";
import * as React from "react";

export default function Home() {
  const { data: session, status: sessionStatus } = useSession();

  React.useEffect(() => {
    if (sessionStatus === "loading") return;
    if (sessionStatus === "authenticated") {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/login";
    }
  }, [sessionStatus, session]);

  return (
    <main className="flex flex-col items-center h-screen justify-between dark:bg-black bg-white dark:bg-dot-white/[0.2] bg-dot-black/[0.2]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Anta&family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap"
        rel="stylesheet"
      />
    </main>
  );
}
