export interface PhoneNumberUser {
  id: string;
  groupId: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
}

export interface RestrictionStatus {
  CA: "unrestricted" | "restricted" | string;
  US: "unrestricted" | "restricted" | string;
  Intl: "unrestricted" | "restricted" | string;
}

export interface PhoneNumberRestrictions {
  messaging: RestrictionStatus;
  calling: RestrictionStatus;
}

export interface PhoneNumber {
  id: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  number: string;
  formattedNumber: string | null;
  forward: string | null;
  portRequestId: string | null;
  portingStatus: string | null;
  symbol: string | null;
  users: PhoneNumberUser[];
  restrictions: PhoneNumberRestrictions;
}

export interface PhoneNumbersResponse {
  data: PhoneNumber[];
}

export interface ListPhoneNumbersParams {
  userId?: string;
}
