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
    queryKey: [params],
    queryFn: ({ pageParam }) =>
      getApiBooks({ ...params, cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    placeholderData: keepPreviousData,
  });

  const books = data?.pages.flatMap((page) => page.data.books) ?? [];

  return {
    books,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
