"use client";
import react from "react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {Button} from "@/components/ui/button";

export const Logout = ({
    children,
    className
}:{children: React.ReactNode, className?: string}) => {
const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Button onClick={handleLogout} className={className}>
      {children}
    </Button>
  );
};

