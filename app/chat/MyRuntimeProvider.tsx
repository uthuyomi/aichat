"use client";

import { AssistantRuntimeProvider, AuiConfig, Tools } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/ai-sdk";
import { OpenUIInstructions, openuiIntegration } from "@openuidev/assistant-ui";
import { shouldContinueAfterOpenUIPrompt } from "@openuidev/assistant-ui/ai-sdk";
import type { ReactNode } from "react";
import { OpenAIImageModel } from "@ai-sdk/openai/internal";

type Props = {
    children: ReactNode;
};

export default function MyRuntimeProvider({ children }: Props) { 
    const runtime = useChatRuntime({
        sendAutomaticallyWhen: shouldContinueAfterOpenUIPrompt,
    });

    const config = AuiConfig({
      tools: Tools({
        toolkit: openuiIntegration.toolkit,
      }),
    });

    return (
        <AssistantRuntimeProvider runtime={runtime} config={config}>
            <OpenUIInstructions />
            {children}
        </AssistantRuntimeProvider>
    )
}