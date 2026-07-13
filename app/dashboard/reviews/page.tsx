"use client"

import { useEffect, useState } from "react";
import { getReviews } from "@/module/review/action";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {ExternalLink, Clock, CheckCircle2, XCircle} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";

export default function ReviewsPage() {
    const { data: reviews, isLoading } = useQuery({
        queryKey: ["reviews"],
        queryFn: async () => {
            return await getReviews();
        },
    });
    if(isLoading){
        return <div>Loading...</div>
    }

    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Reviews History
          </h1>
          <p className="text-muted-foreground">
            View all AI-generated code reviews
          </p>
        </div>
        {reviews?.length === 0 ? (
          <p className="text-muted-foreground">No reviews found.</p>
        ) : (
          <div className="grid gap-4">
            {reviews?.map((review) => (
              <Card
                key={review.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <CardTitle className="text-lg font-semibold">
                          {review.prtitle}
                        </CardTitle>
                        {review.status === "completed" && (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Completed
                          </Badge>
                        )}
                        {review.status === "failed" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-4 w-4" />
                            Failed
                          </Badge>
                        )}
                        {review.status === "pending" && (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-4 w-4" />
                            Pending
                          </Badge>
                        )}
                      </div>
                      <CardDescription>
                        {review.repository?.fullName} - PR #{review.prNumber}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon" 
                    >
                        <a href={review.prUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-5 w-5" />
                        </a>
                      View Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(review.createdAt), {
                          addSuffix: true,
                        })}
                    </div>
                    <div className="prose porse-sm dark:prose-invert max-w-none">
                        <div className="bg-muted p-4 rounded-lg">
                            <pre className="whitespace-pre-wrap text-xs">{review.review.substring(0, 300)}...</pre>
                        </div>
                    </div>
                    <Button variant="outline" size="sm">
                        <a href={review.prUrl} target="_blank" rel="noopener noreferrer">
                            View Full Review
                        </a>
                    </Button>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );

}