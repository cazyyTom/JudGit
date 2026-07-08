"use server";
import {auth} from "@/lib/auth";
import { getSession } from "@/lib/auth-client";
import {headers} from "next/headers";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        redirect("/login");
    }
}
export const requireUnAuth = async () => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (session) {
        redirect("/");
    }
}

