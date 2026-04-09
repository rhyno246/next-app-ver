"use client";
import { useSearchParams } from "next/navigation";
import { useLazyQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { GET_PRODUCTS } from "@/graphql/queries";
import { SearchProductsResponse } from "@/types/type";
import Link from "next/link";
import ProductItem from "@/components/Common/ProductItem";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [fetchProducts, { loading, data }] =
    useLazyQuery<SearchProductsResponse>(GET_PRODUCTS, {
      fetchPolicy: "network-only",
    });

  useEffect(() => {
    fetchProducts({ variables: { search: q } });
  }, [q]);

  const allProducts = data?.products?.data ?? [];
  const total = data?.products?.total ?? 0;

  return (
    <div className="max-w-292.5 mx-auto px-4 sm:px-7-5 xl:px-0 py-10 mt-30">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-dark">
          {q ? (
            <>
              Product found for
              <span className="text-blue ml-2">&quot;{q}&quot;</span>
            </>
          ) : (
            "All Products"
          )}
        </h1>
        {total > 0 && (
          <p className="text-dark-4 mt-1 text-sm">{total} Product</p>
        )}
      </div>

      {!loading && allProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="28" cy="28" r="18" stroke="#CBD5E1" strokeWidth="3" />
            <line
              x1="41"
              y1="41"
              x2="56"
              y2="56"
              stroke="#CBD5E1"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="22"
              y1="28"
              x2="34"
              y2="28"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <line
              x1="28"
              y1="22"
              x2="28"
              y2="34"
              stroke="#CBD5E1"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-dark-4 text-lg">
            Product not found for &quot;{q}&quot;
          </p>
          <Link href="/shop" className="text-blue underline text-sm">
            View all products
          </Link>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-2 rounded-lg aspect-square mb-3" />
              <div className="bg-gray-2 h-4 rounded w-3/4 mb-2" />
              <div className="bg-gray-2 h-4 rounded w-1/3" />
            </div>
          ))}
        </div>
      )}

      {!loading && allProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {allProducts.map((product) => (
            <ProductItem key={product.id} item={product} />
          ))}
        </div>
      )}
    </div>
  );
}
