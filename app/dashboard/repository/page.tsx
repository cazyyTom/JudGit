"use client";
import React from "react";
import { useRepositories } from "@/module/repository/hooks/use-repositories";
import { getRepositories } from "@/module/github/lib/github";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Star, Search,  } from "lucide-react";
import { RepositoryListSkeleton, RepositoryCardSkeleton } from "@/module/repository/components/repository-skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { any } from "better-auth";
import { useConnectRepository } from "@/module/repository/hooks/use-connect-repository";

interface Repository {
  id: number;
  fullName: string;
  name: string;
  description?: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  isConnected: boolean;
}

const RepositoryPage = () => {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepositories();
    const {mutate: connectRepo} =useConnectRepository();

    const [localConnectingId, setLocalConnectingId] = useState<number | null>(null);

    const handleConnect = async (repo: Repository) => {
      setLocalConnectingId(repo.id);
      connectRepo({ 
        owner: repo.fullName.split("/")[0],
        repo: repo.name,
        githubId: BigInt(repo.id)
      }, {
        onSuccess: () => {
          setLocalConnectingId(null);
        },
        onError: () => {
          setLocalConnectingId(null);
        }
      });
    }


  const [searchQuery, setSearchQuery] = useState("");
    const observerTarget = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { threshold: 1.0 }
      );

      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }

      return () => {
        if (observerTarget.current) {
          observer.unobserve(observerTarget.current);
        }
      };
    }, [fetchNextPage, isFetchingNextPage, hasNextPage]);

    if (isLoading) {
      return( <div className= "space-y-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Repositories
            </h1>
            <p className="text-muted-foreground">
              Manage & view your repositories here.
            </p>
            <div>
                <RepositoryListSkeleton/>
            </div>
        </div>
      </div>
      )
    }
  const allRepositories = data?.pages.flatMap((page: any) => page) || [];

  const filteredRepositories = allRepositories.filter(
    (repo: Repository) =>
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  

  return (
    <div className="y-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Repositories
      </h1>
      <p className="text-muted-foreground">
        Manage & view your repositories here.
      </p>

      <div className="mb-4 bg-secondary relative">
        <Search className="bg-secondary absolute left-2 top-2.5 h-4 w-4  text-muted-foreground" />
        <Input
          placeholder="Search repositories..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols gap-4">
        {filteredRepositories.map((repo: Repository) => (
          <Card
            key={repo.id}
            className="hover:shadow-md transition-shadow my-1 bg-secondary"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex 1">
                  <div className="flex items-centre gap-2">
                    <CardTitle className="text-lg font-semibold">
                      {repo.name}
                    </CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-primary text-primary-foreground text-xs"
                    >
                      {repo.language || "Unknown"}
                    </Badge>
                    {repo.isConnected && (
                      <Badge variant="secondary" className="text-xs">
                        Connected
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm text-muted-foreground">
                    {repo.description}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Button className="bg-background border-2" variant="outline" size="sm">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View on GitHub
                    </a>
                  </Button>
                  <Button
                    onClick={() => {
                      handleConnect(repo);
                    }}
                    variant={repo.isConnected ? "outline" : "default"}
                  >
                    {localConnectingId === repo.id
                      ? "Connecting..."
                      : repo.isConnected
                        ? "Disconnect"
                        : "Connect"}
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      <div ref={observerTarget} className="py-4">
{isFetchingNextPage && <RepositoryListSkeleton/>}
{
    !hasNextPage && allRepositories.length > 0 && (
        <p className="text-center text-muted-foreground">
          No more repositories to load.
        </p>
      )
}
      </div>
    </div>
  );
};

export default RepositoryPage;
