"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
// import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";

export async function submitPost(input:string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  await prisma.post.create({
    data: {
        content,
        userId: user.id,
    },
  });
//   const newPost = await prisma.post.create({
//     data: {
//       content,
//       userId: user.id,
//       attachments: {
//         connect: mediaIds.map((id) => ({ id })),
//       },
//     },
//     include: getPostDataInclude(user.id),
//   });
  
}