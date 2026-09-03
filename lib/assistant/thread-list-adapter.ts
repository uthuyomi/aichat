import { useMemo } from "react";
import type { RemoteThreadListAdapter } from "@assistant-ui/react";
import { useThreadHistoryAdapter } from "./thread-history-adapter";

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
    )
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
      const response = await fetch(
          `/api/threads/${remoteId}`
      );

      if (!response.ok) { 
        throw new Error("Failed to fetch thread");
      }

      const { thread }: { thread: ThreadRow } =
          await response.json();

          return toThreadMetadata(thread);
  },

  async generateTitle() {
    throw new Error("Title generation is not implemented yet");
    },

    unstable_useAdapters: useThreadListAdapters,
};
