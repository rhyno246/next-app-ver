"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GET_ALL_COMMENTS } from "@/graphql/queries";
import { useQuery } from "@apollo/client/react";
import { Star } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  rating: number;
  isActive: boolean;
  isHot: boolean;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    email: string;
    image?: string;
  };
  product: {
    id: string;
    name: string;
  };
}

interface GetAllCommentsData {
  getAllComments: Comment[];
}

export default function ListComment() {
  const { data, loading } = useQuery<GetAllCommentsData>(GET_ALL_COMMENTS);

  const comments = data?.getAllComments ?? [];

  if (loading) {
    return (
      <div className="flex flex-col gap-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[500px] mt-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {comments.map((comment) => (
          <Card
            key={comment.id}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={comment.author.image} />
              <AvatarFallback className="text-xs">
                {comment.author.firstName?.[0]}
                {comment.author.lastName?.[0]}
              </AvatarFallback>
            </Avatar>

            <CardContent className="flex-1 p-0 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  {comment.author.firstName} {comment.author.lastName}
                </span>
                {comment.isHot && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0">
                    Hot
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {comment.content}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {comment.product?.name}
              </p>
            </CardContent>

            <CardFooter className="p-0 flex flex-col items-end gap-1 flex-shrink-0">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={
                      i < comment.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }
                  />
                ))}
              </div>
              <Badge
                variant={comment.isActive ? "default" : "secondary"}
                className="text-xs px-1.5 py-0"
              >
                {comment.isActive ? "Active" : "Hidden"}
              </Badge>
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
