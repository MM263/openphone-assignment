import { FormattedDate } from "@/common/components/FormattedDate";
import { cn } from "@/common/lib/utils";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { createFileRoute } from "@tanstack/react-router";
import { Check, CheckCheck, X } from "lucide-react";

export const Route = createFileRoute(
  "/conversations/$phoneId/$participantPhoneId",
)({
  component: Chat,
});

function Chat() {
  const { phoneId, participantPhoneId } = Route.useParams();

  const { data, isLoading, isFetching } = useMessages({
    phoneId,
    participantPhoneId,
  });

  console.log({ data, isLoading, isFetching });

  if (data?.pages.every((p) => p.data.length === 0))
    return <p className="text-slate-400">No messages</p>;

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col gap-1">
        {data?.pages.map((p) =>
          p.data.map((m) => {
            return (
              <div
                className={cn(
                  "flex flex-col gap-0.5  px-5 py-3 border-1 border-solid rounded-3xl",
                  m.direction === "outgoing"
                    ? "ml-auto bg-blue-200 border-blue-400"
                    : "align-bottom bg-slate-100  border-slate-300 mr-auto",
                )}
              >
                <span>{m.text}</span>
                <span className="ml-auto text-xs text-slate-600 flex">
                  <FormattedDate dateString={m.updatedAt} />
                  <div className="ml-1">
                    {m.status === "delivered" ? (
                      <>
                        {" "}
                        <CheckCheck size={15} />
                      </>
                    ) : null}
                    {m.status === "sent" ? <Check /> : null}
                    {m.status === "undelivered" ? <X /> : null}
                  </div>
                </span>
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
