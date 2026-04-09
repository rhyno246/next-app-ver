import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { DocumentNode } from "graphql";

type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type WithId = {
  id: string;
};

type Options = {
  pageSize?: number;
  fetchPolicy?: "network-only" | "cache-first" | "cache-and-network";
  variables?: Record<string, unknown>;
};

export function useInfiniteQuery<TData, TItem extends WithId>(
  query: DocumentNode,
  dataKey: keyof TData,
  options: Options = {}
) {
  const { pageSize = 6, fetchPolicy = "network-only" , variables = {} } = options;
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<TItem[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [prevVariablesKey, setPrevVariablesKey] = useState(JSON.stringify(variables));
  const variablesKey = JSON.stringify(variables);

  if (variablesKey !== prevVariablesKey) {
    setPrevVariablesKey(variablesKey);
    setPage(1);
    setAllItems([]);
    setHasMore(true);
  }

  const { data, loading, error } = useQuery<TData>(query, {
    variables: { page, pageSize , ...variables },
    fetchPolicy,
  });

  useEffect(() => {
    if (!data?.[dataKey]) return;
    const paginated = data[dataKey] as unknown as PaginatedResponse<TItem>;

    const timer = setTimeout(() => {
      setAllItems((prev) =>
        page === 1
          ? paginated.data
          : [
              ...prev,
              ...paginated.data.filter(
                (item: TItem) => !prev.some((p: TItem) => p.id === item.id)
              ),
            ]
      );
      setHasMore(page < paginated.totalPages);
    }, 0);

    return () => clearTimeout(timer);
  }, [data, dataKey, page]);

  const fetchMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return { allItems, loading, error, hasMore, page, fetchMore };
}