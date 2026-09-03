import { useMemo } from "react";

import { useAui } from "@assistant-ui/react";

import type {
  MessageFormatAdapter,
  MessageFormatItem,
  MessageFormatRepository,
  MessageStorageEntry,
  ThreadHistoryAdapter,
} from "@assistant-ui/react";

export function useThreadHistoryAdapter(): ThreadHistoryAdapter {
  const aui = useAui();

  return useMemo(() => ({
    async load() {
      throw new Error(
        "Direct ThreadHistoryAdapter.load() is not supported. Use withFormat().",
      );
    },

    async append() {
      throw new Error(
        "Direct ThreadHistoryAdapter.append() is not supported. Use withFormat().",
      );
    },

    withFormat<TMessage, TStorageFormat extends Record<string, unknown>>(
      formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>,
    ) {
      return {
        async load(): Promise<MessageFormatRepository<TMessage>> {
          const remoteId = aui.threadListItem.getState().remoteId;

          if (!remoteId) {
            return {
              messages: [],
            };
          }

          const response = await fetch(`/api/threads/${remoteId}/messages`);

          if (!response.ok) {
            throw new Error("Failed to load messages");
          }

          const rows: MessageStorageEntry<TStorageFormat>[] =
            await response.json();

          const messages = rows.map((row) => formatAdapter.decode(row));

          return {
            messages,
          };
        },

        async append(item: MessageFormatItem<TMessage>): Promise<void> {
          const { remoteId } = await aui.threadListItem.initialize();

          const content = formatAdapter.encode(item);

          const response = await fetch(`/api/threads/${remoteId}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: formatAdapter.getId(item.message),
              parent_id: item.parentId,
              format: formatAdapter.format,
              content,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save message");
          }
        },

        async update(
          item: MessageFormatItem<TMessage>,
          _localMessageId: string,
        ): Promise<void> {
          const remoteId = aui.threadListItem.getState().remoteId;

          if (!remoteId) {
            return;
          }

          const content = formatAdapter.encode(item);

          const response = await fetch(`/api/threads/${remoteId}/messages`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: formatAdapter.getId(item.message),
              parent_id: item.parentId,
              format: formatAdapter.format,
              content,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to update message");
          }
        },
      };
    },
  }), [aui]);
}
