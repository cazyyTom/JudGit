"use client";
import "./globals.css";
import { useState} from "react";
import { requireAuth } from "@/module/auth/utils/auth-utils";
import { redirect } from "next/navigation";

requireAuth();

export default function Home() {
  const [count, SetCount] = useState(0);

  return (
    redirect("/dashboard")
  );
}
