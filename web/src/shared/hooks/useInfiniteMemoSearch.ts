import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import { getApiMemos, GetApiMemosParams } from "@/external/api";

export function useInfiniteMemoSearch(params: GetApiMemosParams) {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["memos", params.q],
    queryFn: ({ pageParam }) =>
      getApiMemos({ ...params, cursor: pageParam, limit: 20 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.status === 200
        ? (lastPage.data.nextCursor ?? undefined)
        : undefined,
    enabled: params.q.length > 0,
    placeholderData: keepPreviousData,
  });

  const memos =
    data?.pages.flatMap((page) =>
      page.status === 200 ? page.data.memos : []
    ) ?? [];

  return {
    memos,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  };
}
