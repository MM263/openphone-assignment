import { describe, expect, it } from "vitest";
import { Message, MessagesResponse } from "@/common/api/types";
import {
  mergeOptimisticMessage,
  replaceOptimisticMessage,
} from "./optimisitic";
import { InfiniteData } from "@tanstack/react-query";

describe("mergeOptimisticMessage", () => {
  it("should create a new data structure when no existing data", () => {
    const optimisticMessage: Message = {
      id: "temp-123",
      to: ["123"],
      from: "456",
      text: "Hello world",
      phoneNumberId: "456",
      direction: "outgoing",
      userId: null,
      status: "sent",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    const result = mergeOptimisticMessage(null, optimisticMessage);

    expect(result).toEqual({
      pages: [
        { data: [optimisticMessage], totalItems: 1, nextPageToken: null },
      ],
      pageParams: [undefined],
    });
  });

  it("should add optimistic message to the first page of existing data", () => {
    const existingData: InfiniteData<MessagesResponse> = {
      pages: [
        {
          data: [
            {
              id: "msg-1",
              to: ["123"],
              from: "456",
              text: "Earlier message",
              phoneNumberId: "456",
              direction: "outgoing",
              userId: null,
              status: "delivered",
              createdAt: "2023-01-01T00:00:00Z",
              updatedAt: "2023-01-01T00:00:00Z",
            },
          ],
          totalItems: 1,
          nextPageToken: null,
        },
      ],
      pageParams: [undefined],
    };

    const optimisticMessage: Message = {
      id: "temp-123",
      to: ["123"],
      from: "456",
      text: "Hello world",
      phoneNumberId: "456",
      direction: "outgoing",
      userId: null,
      status: "sent",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    const result = mergeOptimisticMessage(existingData, optimisticMessage);

    expect(result.pages[0].data).toHaveLength(2);
    expect(result.pages[0].data[0]).toEqual(optimisticMessage);
    expect(result.pages[0].totalItems).toBe(2);
  });

  it("should correctly handle multiple pages", () => {
    const existingData: InfiniteData<MessagesResponse> = {
      pages: [
        {
          data: [
            {
              id: "msg-1",
              to: ["123"],
              from: "456",
              text: "Recent message",
              phoneNumberId: "456",
              direction: "outgoing",
              userId: null,
              status: "delivered",
              createdAt: "2023-01-02T00:00:00Z",
              updatedAt: "2023-01-02T00:00:00Z",
            },
          ],
          totalItems: 1,
          nextPageToken: "token123",
        },
        {
          data: [
            {
              id: "msg-2",
              to: ["123"],
              from: "456",
              text: "Older message",
              phoneNumberId: "456",
              direction: "outgoing",
              userId: null,
              status: "delivered",
              createdAt: "2023-01-01T00:00:00Z",
              updatedAt: "2023-01-01T00:00:00Z",
            },
          ],
          totalItems: 1,
          nextPageToken: null,
        },
      ],
      pageParams: [undefined, "token123"],
    };

    const optimisticMessage: Message = {
      id: "temp-123",
      to: ["123"],
      from: "456",
      text: "Hello world",
      phoneNumberId: "456",
      direction: "outgoing",
      userId: null,
      status: "sent",
      createdAt: "2023-01-03T00:00:00Z",
      updatedAt: "2023-01-03T00:00:00Z",
    };

    const result = mergeOptimisticMessage(existingData, optimisticMessage);

    // Ensure it's added to the first page only
    expect(result.pages[0].data).toHaveLength(2);
    expect(result.pages[0].data[0]).toEqual(optimisticMessage);
    expect(result.pages[0].totalItems).toBe(2);

    // Ensure second page is unchanged
    expect(result.pages[1].data).toHaveLength(1);
    expect(result.pages[1].totalItems).toBe(1);
  });
});

describe("replaceOptimisticMessage", () => {
  it("should return existing data if no pages", () => {
    const existingData = null;
    const result = replaceOptimisticMessage(
      existingData,
      "temp-123",
      {} as Message,
    );
    expect(result).toEqual(existingData);
  });

  it("should replace an optimistic message with an actual message", () => {
    const optimisticId = "temp-123";
    const existingData: InfiniteData<MessagesResponse> = {
      pages: [
        {
          data: [
            {
              id: optimisticId,
              to: ["123"],
              from: "456",
              text: "Hello world",
              phoneNumberId: "456",
              direction: "outgoing",
              userId: null,
              status: "sent",
              createdAt: "2023-01-01T00:00:00Z",
              updatedAt: "2023-01-01T00:00:00Z",
            },
            {
              id: "msg-1",
              to: ["123"],
              from: "456",
              text: "Earlier message",
              phoneNumberId: "456",
              direction: "outgoing",
              userId: null,
              status: "delivered",
              createdAt: "2023-01-01T00:00:00Z",
              updatedAt: "2023-01-01T00:00:00Z",
            },
          ],
          totalItems: 2,
          nextPageToken: null,
        },
      ],
      pageParams: [undefined],
    };

    const actualMessage: Message = {
      id: "real-123",
      to: ["123"],
      from: "456",
      text: "Hello world",
      phoneNumberId: "456",
      direction: "outgoing",
      userId: null,
      status: "delivered",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    const result = replaceOptimisticMessage(
      existingData,
      optimisticId,
      actualMessage,
    );

    expect(result?.pages[0].data[0].id).toBe("real-123");
    expect(result?.pages[0].data[0].status).toBe("delivered");
    expect(result?.pages[0].data).toHaveLength(2);
  });

  it("should not modify data if optimistic message is not found", () => {
    const existingData: InfiniteData<MessagesResponse> = {
      pages: [
        {
          data: [
            {
              id: "msg-1",
              to: ["123"],
              from: "456",
              text: "Earlier message",
              phoneNumberId: "456",
              direction: "outgoing",
              userId: null,
              status: "delivered",
              createdAt: "2023-01-01T00:00:00Z",
              updatedAt: "2023-01-01T00:00:00Z",
            },
          ],
          totalItems: 1,
          nextPageToken: null,
        },
      ],
      pageParams: [undefined],
    };

    const actualMessage: Message = {
      id: "real-123",
      to: ["123"],
      from: "456",
      text: "Hello world",
      phoneNumberId: "456",
      direction: "outgoing",
      userId: null,
      status: "delivered",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };

    const result = replaceOptimisticMessage(
      existingData,
      "non-existent-id",
      actualMessage,
    );

    // Should remain unchanged when ID doesn't match
    expect(result).toEqual(existingData);
  });
});
