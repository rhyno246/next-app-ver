"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_TOP_ORDER_USERS } from "@/graphql/queries";
import { useQuery } from "@apollo/client/react";

interface TopOrderUser {
  orderCount: number;
  totalAmount: number;
  author: {
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  };
}

interface TopOrderUsersData {
  topOrderUsers: TopOrderUser[];
}

export default function ListItem() {
  const { data, loading } = useQuery<TopOrderUsersData>(GET_TOP_ORDER_USERS, {
    variables: { limit: 6 },
  });

  const users = data?.topOrderUsers ?? [];

  if (loading) {
    return (
      <div className="flex flex-col gap-2 mt-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-[500px] mt-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {users.map((item) => (
          <Card
            key={item.author.email}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarImage src={item.author.image} />
                <AvatarFallback className="text-xs">
                  {item.author.firstName?.[0]}
                  {item.author.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">
                {item.author.firstName} {item.author.lastName}
              </CardTitle>
            </CardContent>
            <CardFooter className="p-0">
              ${item.totalAmount.toFixed(0)}
            </CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
