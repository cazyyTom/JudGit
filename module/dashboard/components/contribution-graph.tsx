"use client";
import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { getContributionStats } from "@/module/dashboard/action/index";

export const ContributionGraph = () => {
  const { theme } = useTheme();
  const { data, isLoading } = useQuery({
    queryKey: ["contribution-graph"],
    queryFn: async () => {
      return await getContributionStats();
    },
    staleTime: 1000 * 60 * 60 * 5, // 5 hours
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="text-muted-foreground animate-pulse">
          Loading contribution data...
        </div>
      </div>
    );
  }

  if (!data || data.contribution.length === 0) {
    return (
      <div className="w-full flex items-center justify-center p-8">
        <div className="text-muted-foreground">
          No contribution data available
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="text-muted-foreground text-sm">
        <span className="text-muted-foreground">{data.totalContributions}</span>{" "}
        total contributions in the last year
      </div>
      <div className="w-full overflow-x-auto">
        <div className="flex justify-center min-w-max">
          <ActivityCalendar
            data={data.contribution}
            colorScheme={theme === "dark" ? "dark" : "light"}
            blockSize={11}
            blockMargin={4}
            fontSize={14}
            showWeekdayLabels={true}
            theme={{
              light: ["#ebedf0", "#e6d5c3", "#cdab89", "#b08257", "#7c5330"],
              dark: ["#1a1518", "#38271b", "#614430", "#8f6849", "#c59b72"],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ContributionGraph;
