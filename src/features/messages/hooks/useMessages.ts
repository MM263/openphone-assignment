import OpenPhoneClient from "@/common/api/client";
import { MessagesResponse, ListMessagesParams } from "@/common/api/types";
import { useInfiniteQuery } from "@tanstack/react-query";

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
    console.log(`Fetching messages page with token: ${pageParam}`);
    const params: ListMessagesParams = {
      phoneNumberId: phoneId,
      participants: [participantPhoneId],
      pageToken: pageParam,
    };
    // Directly return the promise from the client call
    return client.listMessages(params);
  };

  const queryResult = useInfiniteQuery({
    queryKey: ["messages", phoneId, participantPhoneId],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => {
      return lastPage.nextPageToken ?? undefined;
    },
    initialPageParam: undefined,
  });

  return queryResult;
};
