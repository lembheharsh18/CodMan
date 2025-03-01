import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserTooltip from "./UserTooltip";

export default function TrendsSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}

async function WhoToFollow() {
  const { user } = await validateRequest();
  if (!user) return null;

  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Who To Follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-3">
          <UserTooltip user={user}>

          <Link
            href={`/users/${user.username}`}
            className="flex items-center gap-3"
            >
            <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
            <div>
              <p className="line-clamp-1 break-all font-semibold hover:underline">
                {user.displayName}
              </p>
              <p className="line-clamp-1 break-all text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </Link>
          </UserTooltip>
          <FollowButton 
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({followerId}) => followerId === user.id,
            ),
          }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
    async () => {
        const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[a-zA-Z0-9_]+', 'g'))) AS hashtag, COUNT(*) as count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC, hashtag ASC
            LIMIT 5
        `;
        return result.map(row => ({
            hashtag: row.hashtag, 
            count: Number(row.count)
        }));
    },
    ["trending_topics"],
    {
        revalidate: 3 * 60 * 60,
    },
);
async function TrendingTopics() {
  const TrendingTopics = await getTrendingTopics();

  if (!TrendingTopics || TrendingTopics.length === 0) {
    return (
      <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
        <div className="text-xl font-bold">Trending Topics</div>
        <p className="text-muted-foreground">No trending topics found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">Trending Topics</div>
      {TrendingTopics.map(({ hashtag, count }) => {
        if (!hashtag) {
          return null;
        }

        const title = hashtag.split("#")[1];
        return (
          <Link key={title} href={`/hashtag/${title}`} className="block">
            <p
              className="line-clamp-1 break-all font-semibold hover:underline"
              title={hashtag}
            >
              {hashtag}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(count)} {count === 1 ? "post" : "posts"}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
