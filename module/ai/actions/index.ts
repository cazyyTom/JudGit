"use server";

import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { getPullRequestDiff } from "@/module/github/lib/github";

export async function reviewPullRequest(
  owner: string,
  repo: string,
  prNumber: number,
) {
  try {
    const repository = await prisma.repository.findFirst({
      where: {
        owner: owner,
        name: repo,
      },
      include: {
        user: {
          include: {
            accounts: {
              where: {
                providerId: "github",
              },
            },
          },
        },
      },
    });

    if (!repository) {
      throw new Error(
        `Repository ${owner}/${repo} not found in the database. Please connect the repository first.`,
      );
    }

    if (!repository.user) {
      throw new Error(
        `Repository ${owner}/${repo} is missing an associated user record.`,
      );
    }

    const githubAccount = repository.user.accounts[0];
    if (!githubAccount?.accessToken) {
      throw new Error(
        `No GitHub account found for user. Please connect your GitHub account first.`,
      );
    }
    const token = githubAccount.accessToken;

    const { title } = await getPullRequestDiff(owner, repo, prNumber, token);

    await inngest.send({
      name: "pr.review.requested",
      data: {
        owner,
        repo,
        prNumber,
        userId: repository.user.id,
      },
    });
    return {
      success: true,
      message: `Review requested for ${owner}/${repo} PR #${prNumber} with title "${title}"`,
    };
  } catch (error) {
   try{
    const repository = await prisma.repository.findFirst({
      where: {
        owner: owner,
        name: repo,
      },
    });
    if(repository){
      await prisma.review.create({
        data: {
          repositoryId: repository.id,
          prNumber: prNumber,
          prtitle: "Failed to fetch Pr",
        prUrl: `https://github.com/${owner}/${repo}/pull/${prNumber}`,
        userId: repository.userId,
        review: ` Error: ${error instanceof Error ? error.message : "Unknown error"}`,
          status: "failed",
        },
      });
    }
        }catch (dberror) {
console.error("Failed to save error to database:", dberror);
   }
}
}

