"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/ai-sdk";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

export default function MyRuntimeProvider({ children }: Props) { 
    const runtime = useChatRuntime();

    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
        </AssistantRuntimeProvider>
    )
}