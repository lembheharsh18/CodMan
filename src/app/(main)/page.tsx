import PostEditor from "@/components/posts/editor/PostEditor";
import TrendsSidebar from "@/components/TrendsSidebar";
import ForYouFeed from "./ForYouFeed";
import FollowingFeed from "./FollowingFeed";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// or import from "@radix-ui/react-tabs" if using Radix directly

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you" className="w-full">
          <div className="border-b mb-4">
            <TabsList className="flex h-10 w-full bg-transparent">
              <TabsTrigger 
                value="for-you" 
                className="flex-1 relative data-[state=active]:text-blue-600 data-[state=active]:font-medium rounded-none px-4 h-full
                hover:bg-blue-50 transition-all duration-200 ease-in-out
                after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 
                after:bg-blue-500 after:scale-x-0 data-[state=active]:after:scale-x-100 
                after:transition-transform after:duration-300 after:ease-out
                hover:after:scale-x-100 hover:after:opacity-70"
              >
                For you
              </TabsTrigger>
              <TabsTrigger 
                value="following" 
                className="flex-1 relative data-[state=active]:text-blue-600 data-[state=active]:font-medium rounded-none px-4 h-full
                hover:bg-blue-50 transition-all duration-200 ease-in-out
                after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 
                after:bg-blue-500 after:scale-x-0 data-[state=active]:after:scale-x-100 
                after:transition-transform after:duration-300 after:ease-out
                hover:after:scale-x-100 hover:after:opacity-70"
              >
                Following
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent 
            value="for-you" 
            className="mt-0 pt-2 animate-in fade-in-50 slide-in-from-top-3 duration-300"
          >
            <ForYouFeed />
          </TabsContent>
          <TabsContent 
            value="following" 
            className="mt-0 pt-2 animate-in fade-in-50 slide-in-from-top-3 duration-300"
          >
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}