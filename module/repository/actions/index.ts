"use server"
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import {headers} from "next/headers";
import { getRepositories } from "@/module/github/lib/github";

export const fetchRepositories = async (page: number=1, perPage: number = 10) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        throw new Error("Unauthorized");
    }
    const githubRepos = await getRepositories(page, perPage);
   

    const dbRepos = await prisma.repository.findMany({
        where: {
            userId: session.user.id,
        },
    });
    const coonnectedRepoIds = new Set(
      dbRepos.map((repo: any) => repo.githubId)
    );
    return githubRepos.map((repo: any) => ({
      ...repo,
      isConnected: coonnectedRepoIds.has(BigInt(repo.id)),
    }));
}