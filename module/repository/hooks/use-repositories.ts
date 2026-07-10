"use client"
//for infinite scrolling
import {useInfiniteQuery} from "@tanstack/react-query";
import { fetchRepositories } from "../actions/index";


interface Repository {
  id: number;
  name: string;
  description?: string | null;
}
export const useRepositories = (perPage: number = 10) => {
  return useInfiniteQuery<Repository[], Error, any, any, number>({
    queryKey: ["repositories"],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await fetchRepositories(pageParam, 10);
      return data;
    },
    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 10) return undefined; // No more pages to fetch
      return allPages.length + 1;
    },
  });
};