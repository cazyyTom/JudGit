"use server"
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import {headers} from "next/headers";
import { createWebhook, getRepositories } from "@/module/github/lib/github";
import { inngest } from "@/inngest/client";

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
    const connectedRepoMap = new Map(
      dbRepos.map((repo: any) => [repo.githubId.toString(), repo.id])
    );
    return githubRepos.map((repo: any) => ({
      id: repo.id,
      dbId: connectedRepoMap.get(repo.id.toString()) ?? null,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      html_url: repo.html_url,
      stargazers_count: repo.stargazers_count,
      language: repo.language,
      topics: repo.topics,
      isConnected: connectedRepoMap.has(repo.id.toString()),
    }));
}


export  const connectRepository = async (owner:string, repo:string , githubId: bigint) => {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
        throw new Error("Unauthorized");
    }
    //TODO: Check if user can connect more than 5 repositories

    const existing = await prisma.repository.findUnique({
        where: { githubId: BigInt(githubId) },
    });
    if (existing) {
        if (existing.userId !== session.user.id) {
            throw new Error("This repository is already connected by another user");
        }
        return { alreadyConnected: true };
    }

    const webHook = await createWebhook(repo, owner);
    if(webHook){
        await prisma.repository.create({
            data: {
                userId: session.user.id,
                githubId: BigInt(githubId),
                owner: owner,
                name: repo,
                fullName: `${owner}/${repo}`,
                url: `https://github.com/${owner}/${repo}`
            }
        });
    }
    // As we have connected the repo, we'll increase the user's connected repo count

    // TODO: Trigger Repo Indexing for RAG (Fire and Forget)
try{
    await inngest.send({
        name: "repository.connected",
        data:{
            owner,
            repo,
            userId: session.user.id,
        }
    })

}catch(error){
    console.log("Error while triggering repo indexing", error);
}

    return webHook;
}