import OpenPhoneClient from "@/common/api/client";
import { ListPhoneNumbersParams } from "@/common/api/types";
import { useQuery } from "@tanstack/react-query";

const openPhoneClient = OpenPhoneClient.getInstance();

export const useListPhoneNumbers = (params: ListPhoneNumbersParams = {}) => {
  return useQuery({
    queryKey: ["phoneNumbers", params],
    queryFn: () => openPhoneClient.listPhoneNumbers(params),
  });
};
