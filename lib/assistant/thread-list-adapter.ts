import { useMemo } from "react";
import type { RemoteThreadListAdapter } from "@assistant-ui/react";
import { useThreadHistoryAdapter } from "./thread-history-adapter";
import { createAssistantStream } from "assistant-stream";

type ThreadRow = {
  id: string;
  title: string | null;
  status: "regular" | "archived";
  custom: Record<string, unknown> | null;
};

function toThreadMetadata(thread: ThreadRow) {
  return {
    remoteId: thread.id,
    status: thread.status,
    title: thread.title ?? undefined,
    custom: thread.custom ?? undefined,
  };
}

function useThreadListAdapters() {
  const history = useThreadHistoryAdapter();

  return useMemo(
    () => ({
      history,
    }),
    [history],
  );
}

export const threadListAdapter: RemoteThreadListAdapter = {
  async list() {
    const response = await fetch("/api/threads");

    if (!response.ok) {
      throw new Error("Failed to load threads");
    }

    const { threads }: { threads: ThreadRow[] } = await response.json();

    return {
      threads: threads.map(toThreadMetadata),
    };
  },

  async initialize() {
    const response = await fetch("/api/threads", {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error("Failed to create thread");
    }

    const { thread }: { thread: ThreadRow } = await response.json();

    return {
      remoteId: thread.id,
    };
  },

  async rename(remoteId, newTitle) {
    const response = await fetch(`/api/threads/${remoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to rename thread");
    }
  },

  async archive(remoteId) {
    const response = await fetch(`/api/threads/${remoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "archived",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to archive thread");
    }
  },

  async unarchive(remoteId) {
    const response = await fetch(`/api/threads/${remoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: "regular",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to unarchive thread");
    }
  },

  async delete(remoteId) {
    const response = await fetch(`/api/threads/${remoteId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete thread");
    }
  },

  async fetch(remoteId) {
    const response = await fetch(`/api/threads/${remoteId}`);

    if (!response.ok) {
      throw new Error("Failed to fetch thread");
    }

    const { thread }: { thread: ThreadRow } = await response.json();

    return toThreadMetadata(thread);
  },

  async generateTitle(remoteId, unstable_messages) {
    const text = unstable_messages
      .map((message) =>
        message.content
          .filter((part) => part.type === "text")
          .map((part) => part.text)
          .join(""),
      )
      .filter(Boolean)
      .join("\n");

    return createAssistantStream(async (controller) => {
      const response = await fetch(`/api/threads/${remoteId}/title`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate title");
      }

      const { title }: { title: string } = await response.json();

      controller.enqueue({
        type: "part-start",
        path: [0],
        part: {
          type: "text",
        },
      });

      controller.enqueue({
        type: "text-delta",
        path: [0],
        textDelta: title,
      });

      controller.enqueue({
        type: "part-finish",
        path: [0],
      });
    });
  },

  unstable_useAdapters: useThreadListAdapters,
};
