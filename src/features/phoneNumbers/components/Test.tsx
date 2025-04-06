import { useListPhoneNumbers } from "../hooks/useListPhoneNumbers";

export const Test = () => {
  const { data } = useListPhoneNumbers();

  console.log({ data });

  return <div>hi, test</div>;
};
