// src/inngest/functions.ts
import { inngest } from "../client";
import { getRepofileContent } from "../../module/github/lib/github";
import { prisma } from "../../lib/db";
import { indexCodebase, retrieveContext } from "../../module/ai/lib/rag";
  

export const indexRepo = inngest.createFunction(
  {
    id: "index-repo",
    // Move your event trigger here
    triggers: [{ event: "repository.connected" }],
  },
  async ({ event, step }) => {
    const { owner, repo, userId } = event.data;

    // Fetch the files from the repo and index them in the database for RAG
    const files = await step.run("fetch-files", async () => {
      const account = await prisma.account.findFirst({
        where: {
          userId: userId,
          providerId: "github",
        },
      });

      if (!account) {
        throw new Error("No GitHub account found for user");
      }
      return await getRepofileContent(owner, repo, account.accessToken!);
    });

    await step.run("index-codebase", async () => {
      await indexCodebase(`${owner}/${repo}`, files);
    });

    return { success: true, indexedFiles: files.length };
  },
);


