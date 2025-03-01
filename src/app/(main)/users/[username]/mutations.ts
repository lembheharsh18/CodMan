// import { useToast } from "@/components/ui/use-toast";
import { PostsPage } from "@/lib/types";
import { useUploadThing } from "@/lib/uploadthing";
import { UpdateUserProfileValues } from "@/lib/validation";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "./actions";
import { useToast } from "@/hooks/use-toast";

export function useUpdateProfileMutation() {
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    const { startUpload: startAvatarUpload } = useUploadThing("avatar");
  
    const mutation = useMutation({
      mutationFn: async ({
        values,
        avatar,
      }: {
        values: UpdateUserProfileValues;
        avatar?: File;
      }) => {
        // First handle the avatar upload if it exists
        let uploadResult;
        if (avatar) {
          uploadResult = await startAvatarUpload([avatar]);
        }
        
        // Update the profile with the new avatar URL if available
        const updatedValues = {
          ...values,
          // Only add this if you want to immediately update the URL
          // The core.ts onUploadComplete should handle the actual DB update
        };
        
        return Promise.all([
          updateUserProfile(updatedValues),
          uploadResult,
        ]);
      },
      onSuccess: async ([updatedUser, uploadResult]) => {
        const newAvatarUrl = uploadResult?.[0]?.url;
  
        // If we have a new avatar URL, update the cache
        if (newAvatarUrl) {
          // Update any cached user data
          queryClient.setQueryData(["user", updatedUser.id], {
            ...updatedUser,
            avatarUrl: newAvatarUrl,
          });
        }
  
        const queryFilter: QueryFilters = {
          queryKey: ["post-feed"],
        };
  
        await queryClient.cancelQueries(queryFilter);
  
        queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
          queryFilter,
          (oldData) => {
            if (!oldData) return;
            return {
              pageParams: oldData.pageParams,
              pages: oldData.pages.map((page) => ({
                nextCursor: page.nextCursor,
                posts: page.posts.map((post) => {
                  if (post.user.id === updatedUser.id) {
                    return {
                      ...post,
                      user: {
                        ...updatedUser,
                        avatarUrl: newAvatarUrl || updatedUser.avatarUrl,
                      },
                    };
                  }
                  return post;
                }),
              })),
            };
          },
        );
  
        router.refresh();
  
        toast({
          description: "Profile updated",
        });
      },
      onError(error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: "Failed to update profile. Please try again.",
        });
      },
    });
  
    return mutation;
  }