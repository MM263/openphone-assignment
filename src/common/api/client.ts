import { ListPhoneNumbersParams, PhoneNumbersResponse } from "./types";

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

    const url = `${this.baseUrl}/v1/phone-numbers${urlParams.toString() ? "?" + urlParams.toString() : ""}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        `OpenPhone API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }
}

export default OpenPhoneClient;
