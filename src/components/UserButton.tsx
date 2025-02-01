"use client";

import { logout } from "@/app/(auth)/actions";
import { useSession } from "@/app/(main)/SessionProvider";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, LogOutIcon, Monitor, Moon, Sun, UserIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserAvatar from "./UserAvatar";

interface UserButtonProps {
    className? : string
}

export default function UserButton({className}: UserButtonProps){
    const {user} = useSession();
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className={cn("flex-none rounded-full", className)}>
                    <UserAvatar avatarUrl={user.avatarUrl} size={40}/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>
                    Logged ins as @{user.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <Link href={'/users/${user.username'}>
                <DropdownMenuItem>
                    <UserIcon className="mr-2 size-4"/>
                    Profile
                </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator/>
                <DropdownMenuItem
                onClick={()=>{
                    logout();
                }}>
                    <LogOutIcon className="mr-2 size-4"/>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}