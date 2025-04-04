"use client"
import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "./mutations";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
    post : PostData;
    open: boolean;
    onClose: () => void;
}

export default function DeletePostDialog({
    post,
    open,
    onClose,
}: DeletePostDialogProps){
    const router = useRouter();
    const pathname = usePathname();
    const mutation = useDeletePostMutation();

    function handleOpenChange(open: boolean){
        if (!open || !mutation.isPending){
            onClose();
        }
    }
    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Delete Post?</DialogTitle>
      <DialogDescription>
        Are you sure to delete this post?
      </DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <LoadingButton
        variant={"destructive"}
        onClick={() => mutation.mutate(post.id, { onSuccess: onClose })}
        loading={mutation.isPending}
      >
        Delete
      </LoadingButton>
      <Button
        variant="outline"
        onClick={onClose}
        disabled={mutation.isPending}
      >
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    )
}