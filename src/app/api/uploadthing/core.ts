import { createUploadthing, UploadThingError, type FileRouter } from "uploadthing/server";
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
    attachment: f({
      image: { maxFileSize: "4MB", maxFileCount: 5 },
      video: { maxFileSize: "64MB", maxFileCount: 5 },
    })
      .middleware(async () => {
        const { user } = await validateRequest();
  
        if (!user) throw new UploadThingError("Unauthorized");
  
        return {};
      })
      .onUploadComplete(async ({ file }) => {
        const media = await prisma.media.create({
          data: {
            url: file.url.replace(
              "/f/",
              `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            ),
            type: file.type.startsWith("image") ? "IMAGE" : "VIDEO",
          },
        });
  
        return { mediaId: media.id };
      }),
} satisfies FileRouter;