import { Message, MessagesResponse } from "@/common/api/types";
import { InfiniteData } from "@tanstack/react-query";

/**
 * Merges an optimistic message into existing message data
 * @param existingData Existing infinite query data structure
 * @param optimisticMessage Message to add optimistically
 * @returns Updated data structure with the optimistic message added
 */
export function mergeOptimisticMessage(
  existingData: InfiniteData<MessagesResponse> | null,
  optimisticMessage: Message,
) {
  if (!existingData || !existingData.pages || existingData.pages.length === 0) {
    return {
      pages: [
        { data: [optimisticMessage], totalItems: 1, nextPageToken: null },
      ],
      pageParams: [undefined],
    };
  }

  const newPages = [...existingData.pages];
  newPages[0] = {
    ...newPages[0],
    data: [optimisticMessage, ...newPages[0].data],
    totalItems: newPages[0].totalItems + 1,
  };

  return {
    ...existingData,
    pages: newPages,
  };
}

/**
 * Replaces an optimistic message with the actual message from the server
 * @param existingData Existing infinite query data structure
 * @param optimisticMessageId ID of the optimistic message to replace
 * @param actualMessage Actual message from the server
 * @returns Updated data structure with the optimistic message replaced
 */
export function replaceOptimisticMessage(
  existingData: InfiniteData<MessagesResponse> | null,
  optimisticMessageId: string,
  actualMessage: Message,
) {
  if (!existingData || !existingData.pages) return existingData;

  const newPages = existingData.pages.map((page: MessagesResponse) => {
    const updatedData = page.data.map((message: Message) => {
      if (message.id === optimisticMessageId) {
        return actualMessage;
      }
      return message;
    });
    return { ...page, data: updatedData };
  });

  return { ...existingData, pages: newPages };
}
