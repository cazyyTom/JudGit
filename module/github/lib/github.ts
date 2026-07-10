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
