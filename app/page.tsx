"use client";
import "./globals.css";
import { Button } from "@/components/ui/button";
import react from "react";
import { useState, useEffect } from "react";
import { requireAuth } from "@/module/auth/utils/auth-utils";
import { Logout } from "@/module/auth/components/logout";

requireAuth();

export default function Home() {
  const [count, SetCount] = useState(0);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold">Welcome to My App</h1>
      <div className="justify-center flex items-center">
        <p className="text-lg">count: {count}</p>
        <Button onClick={() => SetCount(count + 1)}>Click me</Button>

        <Logout className="ml-4">Logout</Logout>
      </div>
    </main>
  );
}
