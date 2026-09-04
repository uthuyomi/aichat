"use client";

import {
  AssistantRuntimeProvider,
  AuiConfig,
  AuiProvider,
  Tools,
  useAui,
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

console.log("[openui] toolNames:", openuiIntegration.toolNames);
console.log("[openui] toolkit:", openuiIntegration.toolkit);

type Props = {
  children: ReactNode;
};

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

function OpenUIConfigProvider({ children }: Props) {
  const aui = useAui();

  const config = AuiConfig({
    tools: Tools({
      toolkit: openuiIntegration.toolkit,
    }),
  });

  return (
    <AuiProvider extends={aui} config={config}>
      <OpenUIInstructions />

      {children}
    </AuiProvider>
  );
}

export default function MyRuntimeProvider({ children }: Props) {
  const runtime = useRemoteThreadListRuntime({
    runtimeHook: useChatRuntimeWithOpenUI,
    adapter: threadListAdapter,
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <OpenUIConfigProvider>{children}</OpenUIConfigProvider>
    </AssistantRuntimeProvider>
  );
}
