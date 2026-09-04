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

  console.log("[history] hook created");

  return useMemo(
    () => ({
      async load() {
        console.log("[history] direct load called");

        throw new Error(
          "Direct ThreadHistoryAdapter.load() is not supported. Use withFormat().",
        );
      },

      async append() {
        console.log("[history] direct append called");

        throw new Error(
          "Direct ThreadHistoryAdapter.append() is not supported. Use withFormat().",
        );
      },

      withFormat<TMessage, TStorageFormat extends Record<string, unknown>>(
        formatAdapter: MessageFormatAdapter<TMessage, TStorageFormat>,
      ) {
        console.log("[history] withFormat called", formatAdapter.format);

        return {
          async load(): Promise<MessageFormatRepository<TMessage>> {
            console.log("[history] formatted load called");

            const remoteId = aui.threadListItem.getState().remoteId;

            console.log("[history] load remoteId:", remoteId);

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

            console.log("[history] loaded message rows:", rows.length);

            const messages = rows.map((row) => formatAdapter.decode(row));

            return {
              messages,
            };
          },

          async append(item: MessageFormatItem<TMessage>): Promise<void> {
            console.log("[history] formatted append called");

            const { remoteId } = await aui.threadListItem.initialize();

            console.log("[history] append remoteId:", remoteId);

            const content = formatAdapter.encode(item);

            const messageId = formatAdapter.getId(item.message);

            console.log("[history] append messageId:", messageId);

            const response = await fetch(`/api/threads/${remoteId}/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: messageId,
                parent_id: item.parentId,
                format: formatAdapter.format,
                content,
              }),
            });

            console.log("[history] append response:", response.status);

            if (!response.ok) {
              throw new Error("Failed to save message");
            }
          },

          async update(
            item: MessageFormatItem<TMessage>,
            _localMessageId: string,
          ): Promise<void> {
            console.log("[history] formatted update called");

            const remoteId = aui.threadListItem.getState().remoteId;

            console.log("[history] update remoteId:", remoteId);

            if (!remoteId) {
              console.log("[history] update skipped: no remoteId");

              return;
            }

            const content = formatAdapter.encode(item);

            const messageId = formatAdapter.getId(item.message);

            console.log("[history] update messageId:", messageId);

            const response = await fetch(`/api/threads/${remoteId}/messages`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                id: messageId,
                parent_id: item.parentId,
                format: formatAdapter.format,
                content,
              }),
            });

            console.log("[history] update response:", response.status);

            if (!response.ok) {
              throw new Error("Failed to update message");
            }
          },
        };
      },
    }),
    [aui],
  );
}
