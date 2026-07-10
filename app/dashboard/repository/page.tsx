"use client"
import React from 'react'
import{ useRepositories } from '@/module/repository/hooks/use-repositories'
import {getRepositories} from '@/module/github/lib/github'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {ExternalLink, Star, Search} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

interface Repository {
  id: number;
  name: string;
  description?: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  topics: string[];
  isConnected: boolean;
}


const RepositoryPage = () => {
   const { 
    data,
isLoading,
fetchNextPage,
hasNextPage,
isFetchingNextPage,
  } = useRepositories();
  const [searchQuery, setSearchQuery] = useState('');

  const allRepositories = data?.pages.flatMap(page => page) || [];

  return (
    <div className="y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Repositories</h1>
      <p className="text-muted-foreground">
        Manage & view your repositories here.
      </p>

      <div className="bg-secondary relative">
        <Search className="bg-secondary absolute left-2 top-2.5 h-4 w-4 text-muted-foreground"  />
        <Input
          placeholder="Search repositories..."
          className="pl-8"
          value={searchQuery}
          onChange = {(e) => setSearchQuery(e.target.value)}
        />

      </div>
    </div>
  )
}

export default RepositoryPage
