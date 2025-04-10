import { SendMessageParams } from "@/common/api/types";
import { FormattedDate } from "@/common/components/FormattedDate";
import { Button } from "@/common/components/ui/button";
import { Textarea } from "@/common/components/ui/textarea";
import { cn } from "@/common/lib/utils";
import { useMessages } from "@/features/messages/hooks/useMessages";
import { createFileRoute } from "@tanstack/react-router";
import { Check, CheckCheck, Loader2, SendHorizontal, X } from "lucide-react";
import { useRef, useEffect, useState, useCallback } from "react";

export const Route = createFileRoute(
  "/conversations/$phoneId/$participantPhoneId",
)({
  component: Chat,
});

function Chat() {
  const { phoneId, participantPhoneId } = Route.useParams();
  const {
    query: { data: messagesData, isLoading, isError },
    sendMessageMutation,
  } = useMessages({
    phoneId: phoneId,
    participantPhoneId: participantPhoneId,
  });

  useEffect(() => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  const bottomScrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesData]);

  // Hack to ensure width of the chat at the bottom
  const widthRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const calculateWidth = () => {
      if (widthRef.current) {
        document.documentElement.style.setProperty(
          "--chat-parent-width",
          `${widthRef.current.offsetWidth}px`,
        );
      }
    };
    calculateWidth();
    window.addEventListener("resize", calculateWidth);
    return () => window.removeEventListener("resize", calculateWidth);
  }, []);

  const [text, setText] = useState("");

  const submitText = useCallback(() => {
    if (text === "") return;
    if (text.length > 1000) return;

    const trimmedText = text.trim();
    if (!trimmedText || sendMessageMutation.isPending) {
      return;
    }

    const messagePayload: SendMessageParams = {
      content: trimmedText,
      from: phoneId,
      to: [participantPhoneId],
    };

    sendMessageMutation.mutate(messagePayload);
    setText("");
  }, [text, phoneId, participantPhoneId, sendMessageMutation]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        submitText();
      }
    },
    [submitText],
  );

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  if (isLoading) {
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        ref={widthRef}
      >
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (isError) {
    // Logging
    return <p className="text-red-400">Error fetching messages</p>;
  }

  if (messagesData?.pages.every((p) => p.data.length === 0))
    return <p className="text-slate-400">No messages</p>;

  return (
    <div className="relative w-full h-full max-w-full" ref={widthRef}>
      <div className="flex flex-col gap-1 max-w-full">
        {messagesData?.pages.toReversed().map((p) =>
          p.data.toReversed().map((m) => {
            return (
              <div
                key={m.id}
                className={cn(
                  "flex flex-col gap-0.5 px-5 py-3 border-1 border-solid rounded-3xl break-all max-w-full",
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
                    {m.status === "sent" ? <Check size={15} /> : null}
                    {m.status === "undelivered" ? <X size={15} /> : null}
                  </div>
                </span>
              </div>
            );
          }),
        )}
        <div ref={bottomScrollRef} className="mb-50" />
      </div>
      <div
        style={{ width: "var(--chat-parent-width)" }}
        className="bottom-5 fixed"
      >
        <Textarea
          className="border-slate-500 border-2 h-32 scroll-p-20"
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <div className="fixed bottom-8 right-10 flex gap-3 items-center">
          <p className={text.length > 1000 ? "text-red-400" : "text-slate-400"}>
            {1000 - text.length}
          </p>
          <Button disabled={text.length > 1000} onClick={submitText}>
            Send <SendHorizontal />
          </Button>
        </div>
      </div>
    </div>
  );
}
