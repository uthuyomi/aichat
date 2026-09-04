"use client";

import {
  AssistantRuntimeProvider,
  AuiConfig,
  Tools,
  useAssistantInstructions,
  useRemoteThreadListRuntime,
  useRuntimeAdapters,
} from "@assistant-ui/react";
import { threadListAdapter } from "@/lib/assistant/thread-list-adapter";
import { useChatRuntime } from "@assistant-ui/ai-sdk";
import { createOpenUIIntegration } from "@openuidev/assistant-ui";
import { shouldContinueAfterOpenUIPrompt } from "@openuidev/assistant-ui/ai-sdk";
import type { ReactNode } from "react";

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

function useChatRuntimeWithOpenUI() { 
  const adapters = useRuntimeAdapters();

  return useChatRuntime({
    adapters: adapters ?? undefined,
    sendAutomaticallyWhen: shouldContinueAfterOpenUIPrompt,
  });
}

type Props = {
    children: ReactNode;
};

export default function MyRuntimeProvider({ children }: Props) { 
  const runtime = useRemoteThreadListRuntime({
    runtimeHook: useChatRuntimeWithOpenUI,
    adapter: threadListAdapter,
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