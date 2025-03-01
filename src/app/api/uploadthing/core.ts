import { createUploadthing, type FileRouter } from "uploadthing/server";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

const f = createUploadthing();

export const fileRouter = {
  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      // Validate user is authenticated
      const { user } = await validateRequest();
      
      if (!user) throw new Error("Unauthorized");
      
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Update the user's avatarUrl in the database
      const updatedUser = await prisma.user.update({
        where: { id: metadata.userId },
        data: { avatarUrl: file.url },
      });
      
      return { avatarUrl: file.url };
    }),
} satisfies FileRouter;