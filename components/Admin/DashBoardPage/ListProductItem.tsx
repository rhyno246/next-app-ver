"use client";

import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_BEST_SELLER } from "@/graphql/queries";
import { Products } from "@/types/type";
import { useQuery } from "@apollo/client/react";
import Image from "next/image";
type ProductBestSeller = {
  productBestSeller: Products[];
};
export default function ListProductItem() {
  const { data, loading } = useQuery<ProductBestSeller>(GET_BEST_SELLER);
  if (loading) {
    return (
      <div className="flex flex-col gap-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const products = data?.productBestSeller ?? [];
  return (
    <ScrollArea className="max-h-[500px] mt-4 overflow-y-auto">
      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <Card
            key={product.id}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <div className="w-10 h-10 rounded-sm relative overflow-hidden">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">
                {product.title}
              </CardTitle>
            </CardContent>
            <CardFooter className="p-0">${product.price}</CardFooter>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
