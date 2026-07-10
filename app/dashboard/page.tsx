"use client";
import React from "react";
import { fetchUserContribution, getGithubToken } from "@/module/github/lib/github";
import {getDashboardStats, getMonthlyStatus} from "@/module/dashboard/action/index";
import {Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { auth } from "@/lib/auth";
import {useQuery} from "@tanstack/react-query";
import { GitCommit, GitPullRequest, MessageSquare, GitBranch } from "lucide-react";
import { ContributionGraph } from "@/module/dashboard/components/contribution-graph";


const MainPage = () => {
const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
       return await getDashboardStats()
    },
       refetchOnWindowFocus: false,
    });

  const { data: monthlyActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey:['monthly-activity'],
    queryFn: async () => {
     return await getMonthlyStatus();
    },
      refetchOnWindowFocus: false,
  })


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p>Ovierview of you coding activity nad AI reviews</p>

        <div className="grid gap-4 mt-4 md:grid-cols-4">
          <Card className=" bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">
                Total Repositories
              </CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoadingStats ? "getting data..." : stats?.totalRepos || 0}
              </p>
            </CardContent>
          </Card>
          <Card className=" bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">
                Total Commits
              </CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoadingStats ? "getting data..." : stats?.totalCommits || 0}
              </p>
            </CardContent>
          </Card>
          <Card className=" bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
              <CardTitle className="text-sm font-medium">
                Total Pull Requests
              </CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoadingStats ? "getting data..." : stats?.totalPRs || 0}
              </p>
            </CardContent>
          </Card>
          <Card className=" bg-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reviews
              </CardTitle>
              <GitBranch className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {isLoadingStats ? "getting data..." : stats?.totalReviews || 0}
              </p>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-secondary mt-4 mb-4 border-2 border-border">
          <CardHeader>
            <CardTitle className="text-foreground font-2xl font-bold">
              Contribution Activity
            </CardTitle>
            <CardDescription>
              Visualizing your coding frequency over the last year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContributionGraph />
          </CardContent>
        </Card>

        <div className=" grid gap-4 mt-4 md:grid-cols-2">
          <Card className="bg-secondary col-span-2">
            <CardHeader>
              <CardTitle className="text-foreground font-2xl font-bold">
                Activity Overview
              </CardTitle>
              <CardDescription>
                Monthly breakdown of your commits, PRS,and reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingActivity ? (
                <div className="w-full flex items-center justify-center p-8">
                  <div className="text-muted-foreground animate-pulse">
                    <Spinner>Loading activity data...</Spinner>
                  </div>
                </div>
              ) : (
                <div className="w-full h-80">
                  <ResponsiveContainer className="w-full h-full">
                    <BarChart
                      data={monthlyActivity || []}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                        }}
                        itemStyle={{ color: "var(--foreground)" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="commits"
                        name="Commits"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="prs"
                        name="Pull Requests"
                        fill="#82ca9d"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="reviews"
                        name="AI Reviews"
                        fill="#ffc658"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
