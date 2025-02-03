"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/UserAvatar";
import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useDropzone } from "@uploadthing/react";
import { ImageIcon, Loader2, X } from "lucide-react";
import Image from "next/image";
import { ClipboardEvent, useRef, useEffect, useState } from "react";
import { submitPost } from "./actions";

export default function PostEditor() {
    const { user } = useSession();
    const [isClient, setIsClient] = useState(false); // Track client-side rendering

    useEffect(() => {
        setIsClient(true); // Set to true after mounting on the client
    }, []);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
            }),
            Placeholder.configure({
                placeholder: "What's crack-a-lackin'?",
            }),
        ],
    });

    const input = editor?.getText({
        blockSeparator: "\n",
    }) || "";

    async function onSubmit() {
        await submitPost(input);
        editor?.commands.clearContent();
    }

    if (!isClient) {
        return <div>Loading editor...</div>; // Fallback during SSR
    }

    return (
        <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex gap-5">
                <UserAvatar avatarUrl={user.avatarUrl} className="hidden sm:inline" />
                <EditorContent
                    editor={editor}
                    className="max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
                />
            </div>
            <div className="flex justify-end">
                <Button
                    onClick={onSubmit}
                    disabled={!input.trim()}
                    className="min-w-20"
                >
                    Post
                </Button>
            </div>
        </div>
    );
}