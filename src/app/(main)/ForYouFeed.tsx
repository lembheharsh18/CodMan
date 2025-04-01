// ForYouFeed.tsx
"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, RefreshCcw } from "lucide-react";

export default function ForYouFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "for-you"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/for-you",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (status === "pending") {
    return <PostsLoadingSkeleton />;
  }

  if (status === "success" && !posts.length && !hasNextPage) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-primary/30 space-y-4 transition-all duration-200 hover:border-primary/50 hover:bg-primary/5">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <RefreshCcw className="w-8 h-8 text-primary" />
        </div>
        <p className="text-lg font-medium">No posts yet</p>
        <p className="text-text-secondary max-w-md">
          Be the first one to share a post or check back later when others have posted content.
        </p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors duration-200"
        >
          Refresh feed
        </button>
      </div>
    );
  }


  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-destructive space-y-4 transition-all duration-200 hover:bg-red-50/50">
        <p className="text-destructive font-medium">An error occurred while loading posts.</p>
        <button 
          onClick={() => refetch()}
          className="px-4 py-2 rounded-md bg-destructive text-white hover:bg-destructive/90 transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] rounded-lg"
        >
          <Post post={post} />
        </div>
      ))}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="animate-spin text-blue-500" />
        </div>
      )}
    </InfiniteScrollContainer>
  );
}