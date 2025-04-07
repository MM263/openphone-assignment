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

export interface ListConversationsParams {
  phoneNumbers?: string[]; // Array of phone number IDs or E.164 strings
  userId?: string;
  createdAfter?: string; // ISO_8601 format
  createdBefore?: string; // ISO_8601 format
  excludeInactive?: boolean;
  updatedAfter?: string; // ISO_8601 format
  updatedBefore?: string; // ISO_8601 format
  maxResults?: number; // default: 10, range: 1-100
  pageToken?: string;
  // phoneNumber?: string; // Deprecated, prefer phoneNumbers
}

export interface Conversation {
  assignedTo: string | null;
  createdAt: string | null; // ISO_8601 format
  deletedAt: string | null; // ISO_8601 format
  id: string;
  lastActivityAt: string | null; // ISO_8601 format
  lastActivityId: string | null;
  mutedUntil: string | null; // ISO_8601 format
  name: string | null;
  participants: string[]; // E.164 format
  phoneNumberId: string;
  snoozedUntil: string | null; // ISO_8601 format
  updatedAt: string | null; // ISO_8601 format
}

export interface ConversationsResponse {
  data: Conversation[];
  totalItems: number;
  nextPageToken: string | null;
}

export interface ListMessagesParams {
  phoneNumberId: string; // Required
  participants: string[]; // Required, E.164 format
  userId?: string;
  createdAfter?: string; // ISO_8601 format
  createdBefore?: string; // ISO_8601 format
  maxResults?: number; // default: 10, range: 1-100
  pageToken?: string;
  // 'since' is deprecated, so we won't include it in the primary interface
}

export interface Message {
  id: string;
  to: string[]; // E.164 format
  from: string; // E.164 format
  text: string; // Can be null or empty for media messages potentially
  phoneNumberId: string;
  direction: "incoming" | "outgoing"; // Assuming these are the possibilities
  userId: string | null; // User who sent/handled the message if applicable
  status: string; // e.g., "sent", "delivered", "failed", "received"
  createdAt: string; // ISO_8601 format
  updatedAt: string; // ISO_8601 format
  // Potentially add fields for media, errors, etc. if the API supports them
}

export interface MessagesResponse {
  data: Message[];
  totalItems: number;
  nextPageToken: string | null;
}
