"use client"
import { Session, User } from "lucia"
import { DEFAULT_SANS_SERIF_FONT } from "next/dist/shared/lib/constants";
import React,{createContext, useContext} from "react";

interface SessionContext {
    user : User,
    session: Session;
}

const SessionContext = createContext<SessionContext | null>(null)

export default function SessionProvider({
    children,
    value
}: React.PropsWithChildren<{value :SessionContext}>){
    return <SessionContext.Provider value={value}>
        {children}
    </SessionContext.Provider>
}

export function useSession(){
    const context = useContext(SessionContext)
    if(!context){
        throw new Error("useSession must be used within a SessionProvider")
    }
    return context
}