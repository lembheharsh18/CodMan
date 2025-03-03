"use client";

import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import Link from "next/link";

export default function FollowingFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["post-feed", "following"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/posts/following",
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
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed space-y-4 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
        <div className="w-16 h-16 rounded-full bg-blue-100/50 flex items-center justify-center">
          <UserPlus className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-lg font-medium">Your following feed is empty</p>
        <p className="text-muted-foreground max-w-md">
          When you follow people, their posts will appear here. Find some interesting profiles to follow!
        </p>
        <Link 
          href="/explore/users"
          className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
        >
          Discover people
        </Link>
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
          className="transition-all duration-200 hover:shadow-md hover:translate-y-[-2px] hover:border-blue-300 rounded-lg"
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