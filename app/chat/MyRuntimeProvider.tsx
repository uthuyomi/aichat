"use client";

import { AssistantRuntimeProvider, AuiConfig, Tools, useAssistantInstructions } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/ai-sdk";
import { createOpenUIIntegration } from "@openuidev/assistant-ui";
import { shouldContinueAfterOpenUIPrompt } from "@openuidev/assistant-ui/ai-sdk";
import type { ReactNode } from "react";
import { OpenAIImageModel } from "@ai-sdk/openai/internal";

const openuiIntegration = createOpenUIIntegration({
  additionalRules: [
    "Omit optional arguments when no valid value is available.",
    "Never use an empty string as a placeholder for an optional argument.",
    "Never pass a string to a field that expects an object.",
    "For image fields, only provide a valid image object matching the component schema. Otherwise omit the image argument entirely.",
    "Before emitting a component call, ensure every positional argument matches the component signature and expected type.",
  ],
});

function OpenUIInstructions() {
    useAssistantInstructions(openuiIntegration.instructions);
    return null;
 }

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