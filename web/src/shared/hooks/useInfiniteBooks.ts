import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getApiBooks, GetApiBooksParams } from "@/external/api";

export function useInfiniteBooks(params: GetApiBooksParams) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: [
      "books",
      params.tags,
      params.status,
      params.sortBy,
      params.order,
    ],
    queryFn: ({ pageParam }) =>
      getApiBooks({ ...params, cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.status === 200 ? lastPage.data.nextCursor : undefined,
    placeholderData: keepPreviousData,
  });

  const books =
    data?.pages.flatMap((page) =>
      page.status === 200 ? page.data.books : []
    ) ?? [];

  return {
    books,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
