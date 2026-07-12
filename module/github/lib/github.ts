import { Octokit } from "octokit";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";
import { headers } from "next/headers";
export { headers } from "next/headers";

//For getting github access token from the request headers
export const getGithubToken = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    throw new Error("Unauthorized");
  }
  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });
  if (!account) {
    throw new Error("No access token found for the user");
  }
  return account.accessToken;
};

// lets now fetch the github user data using the access token
export async function fetchUserContribution(token: string | null, username: string) {
  const octokit = new Octokit({
    auth: token,
  });
  const query = `
  query ($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              color}
              }
            }
        }
      }
          }`;

          interface Contributiondata {
            user: {
              contributionsCollection: {
                contributionCalendar: {
                  totalContributions: number;
                  weeks: {
                    contributionDays: {
                      date: string;
                      contributionCount: number;
                      color: string;
                    }[];
                  }[];
                };
              };
            };
          }
          try{
const response: Contributiondata = await octokit.graphql(query, {
  username: username,
});
return response.user.contributionsCollection.contributionCalendar;
          }
          catch (error) {
 throw new Error("Error fetching user contribution data: " + error);
          }
}

//Lets now fetch the github user repositories using the access token
export const getRepositories = async (page: number , perPage: number=10) => {
  const token = await getGithubToken();
  const octokit = new Octokit({
    auth: token,
  });
  const{data} = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility: "all",
    per_page: perPage,
    page: page,
  })

  return data;
}

export const createWebhook = async (repoName: string, owner: string) => {
  const token = await getGithubToken();
  const octokit = new Octokit({
    auth: token,
  });

const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

const{data:hooks} = await octokit.rest.repos.listWebhooks({
  owner: owner,
  repo: repoName,
})
const existingHook = hooks.find((hook) => hook.config.url === webhookUrl);
if (existingHook) {
  return existingHook;
}

const {data} = await octokit.rest.repos.createWebhook({
  owner: owner,
  repo: repoName,
  config: {
    url: webhookUrl,
    content_type: "json",
  },
  events: [ "pull_request"],
});
return data;
}

export const deleteWebhook = async (repoName: string, owner: string) => {
  const token = await getGithubToken();
  const octokit = new Octokit({
    auth: token,
  });

  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/api/webhooks/github`;

  try{
    const {data:hooks} = await octokit.rest.repos.listWebhooks({
      owner: owner,
      repo: repoName,
    });
    const webhookToDelete = hooks.find((hook) => hook.config.url === webhookUrl);
    if (webhookToDelete) {
      await octokit.rest.repos.deleteWebhook({
        owner: owner,
        repo: repoName,
        hook_id: webhookToDelete.id,
      });
      return { message: "Webhook deleted successfully" };
    }
    return { message: "No webhook found to delete" };
  }
  catch (error) {
    throw new Error("Error deleting webhook: " + error);
  }
}
