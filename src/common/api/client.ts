import {
  ListPhoneNumbersParams,
  PhoneNumbersResponse,
  ListConversationsParams, // Import new type
  ConversationsResponse,
  ListMessagesParams,
  MessagesResponse, // Import new type
} from "./types";

class OpenPhoneClient {
  private static instance: OpenPhoneClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = "http://localhost:3001/api";
  }

  public static getInstance(): OpenPhoneClient {
    if (!OpenPhoneClient.instance) {
      OpenPhoneClient.instance = new OpenPhoneClient();
    }
    return OpenPhoneClient.instance;
  }

  public async listPhoneNumbers(
    params: ListPhoneNumbersParams = {},
  ): Promise<PhoneNumbersResponse> {
    const urlParams = new URLSearchParams();
    if (params.userId) urlParams.append("userId", params.userId);

    const queryString = urlParams.toString();
    const url = `${this.baseUrl}/v1/phone-numbers${queryString ? "?" + queryString : ""}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `OpenPhone API error [listPhoneNumbers]: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  /**
   * Fetches a paginated list of conversations.
   * Can be filtered by various parameters.
   * Results are returned in descending order based on the most recent conversation activity.
   * @param params - Optional filtering and pagination parameters.
   * @returns A promise that resolves to the list of conversations.
   */
  public async listConversations(
    params: ListConversationsParams = {},
  ): Promise<ConversationsResponse> {
    const urlParams = new URLSearchParams();

    // Append parameters if they exist
    if (params.userId) urlParams.append("userId", params.userId);
    if (params.createdAfter)
      urlParams.append("createdAfter", params.createdAfter);
    if (params.createdBefore)
      urlParams.append("createdBefore", params.createdBefore);
    if (params.updatedAfter)
      urlParams.append("updatedAfter", params.updatedAfter);
    if (params.updatedBefore)
      urlParams.append("updatedBefore", params.updatedBefore);
    if (params.pageToken) urlParams.append("pageToken", params.pageToken);

    if (params.excludeInactive !== undefined) {
      urlParams.append("excludeInactive", String(params.excludeInactive));
    }

    urlParams.append("maxResults", String(params.maxResults ?? 100));

    if (params.phoneNumbers && params.phoneNumbers.length > 0) {
      params.phoneNumbers.forEach((pn) => urlParams.append("phoneNumbers", pn));
    }

    const queryString = urlParams.toString();
    const url = `${this.baseUrl}/v1/conversations${queryString ? "?" + queryString : ""}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `OpenPhone API error [listConversations]: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<ConversationsResponse>;
  }

  public async listMessages(
    params: ListMessagesParams,
  ): Promise<MessagesResponse> {
    if (
      !params.phoneNumberId ||
      !params.participants ||
      params.participants.length === 0
    ) {
      throw new Error(
        "phoneNumberId and at least one participant are required for listMessages.",
      );
    }

    const urlParams = new URLSearchParams();

    urlParams.append("phoneNumberId", params.phoneNumberId);
    params.participants.forEach((p) => urlParams.append("participants", p));

    // Append optional parameters
    if (params.userId) urlParams.append("userId", params.userId);
    if (params.createdAfter)
      urlParams.append("createdAfter", params.createdAfter);
    if (params.createdBefore)
      urlParams.append("createdBefore", params.createdBefore);
    if (params.pageToken) urlParams.append("pageToken", params.pageToken);

    urlParams.append("maxResults", String(params.maxResults ?? 100));

    const queryString = urlParams.toString();
    const url = `${this.baseUrl}/v1/messages${queryString ? "?" + queryString : ""}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `OpenPhone API error [listMessages]: ${response.status} ${response.statusText}`,
      );
    }

    return response.json() as Promise<MessagesResponse>;
  }
}

export default OpenPhoneClient;
