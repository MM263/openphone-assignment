import OpenPhoneClient from "@/common/api/client";
import {
  MessagesResponse,
  ListMessagesParams,
  Message,
  SendMessageParams,
} from "@/common/api/types";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

interface UseMessagesParams {
  phoneId: string;
  participantPhoneId: string;
}

const client = OpenPhoneClient.getInstance();

export const useMessages = ({
  phoneId,
  participantPhoneId,
}: UseMessagesParams) => {
  const fetchMessages = async ({
    pageParam,
  }: {
    pageParam?: string;
  }): Promise<MessagesResponse> => {
    const params: ListMessagesParams = {
      phoneNumberId: phoneId,
      participants: [participantPhoneId],
      pageToken: pageParam,
    };
    return client.listMessages(params);
  };

  const query = useInfiniteQuery({
    queryKey: ["messages", phoneId, participantPhoneId],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageToken ?? undefined;
    },
    initialPageParam: undefined,
  });

  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (newMessage: SendMessageParams) => {
      return client.sendMessage(newMessage);
    },
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["messages", phoneId, participantPhoneId],
      });

      const previousMessages = queryClient.getQueryData([
        "messages",
        phoneId,
        participantPhoneId,
      ]);

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`, // Temporary ID
        to: [participantPhoneId],
        from: phoneId,
        text: newMessage.content,
        phoneNumberId: phoneId,
        direction: "outgoing",
        userId: null,
        status: "sent", // Initial status
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update the cache with our optimistic message
      queryClient.setQueryData(
        ["messages", phoneId, participantPhoneId],
        (old: InfiniteData<MessagesResponse>) => {
          // Handle first page case
          if (!old || !old.pages || old.pages.length === 0) {
            return {
              pages: [
                {
                  data: [optimisticMessage],
                  totalItems: 1,
                  nextPageToken: null,
                },
              ],
              pageParams: [undefined],
            };
          }

          // Clone the pages
          const newPages = [...old.pages];
          // Add the optimistic message to the most recent page
          newPages[0] = {
            ...newPages[0],
            data: [optimisticMessage, ...newPages[0].data],
            totalItems: newPages[0].totalItems + 1,
          };

          return {
            ...old,
            pages: newPages,
          };
        },
      );

      return { previousMessages, optimisticMessage };
    },
    onError: (error, _newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", phoneId, participantPhoneId],
          context.previousMessages,
        );
      }
      console.error("Error sending message:", error);
      alert(`Failed to send message: ${error.message}`);
    },
    onSuccess: (result, _variables, context) => {
      // Update the optimistic message with the real data
      if (context?.optimisticMessage) {
        queryClient.setQueryData(
          ["messages", phoneId, participantPhoneId],
          (old: InfiniteData<MessagesResponse>) => {
            if (!old || !old.pages) return old;

            const newPages = old.pages.map((page: MessagesResponse) => {
              const updatedData = page.data.map((message: Message) => {
                // Replace the optimistic message with the real one
                if (message.id === context.optimisticMessage.id) {
                  return result.data;
                }
                return message;
              });
              return { ...page, data: updatedData };
            });

            return { ...old, pages: newPages };
          },
        );
      }
    },
    onSettled: () => {
      // Refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({
        queryKey: ["messages", phoneId, participantPhoneId],
      });
    },
  });

  return { query, sendMessageMutation };
};
