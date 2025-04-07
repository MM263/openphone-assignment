import OpenPhoneClient from "@/common/api/client";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/conversations/$phoneId/")({
  loader: async ({ params: { phoneId } }) => {
    try {
      const client = OpenPhoneClient.getInstance();

      const conversations = await client.listConversations({
        phoneNumbers: [phoneId],
      });

      return conversations;
    } catch (error) {
      console.error("Failed to load phone numbers:", error);
      throw new Error("Failed to load phone numbers");
    }
  },
  component: Conversations,
});

function Conversations() {
  const params = Route.useParams();
  const conversations = Route.useLoaderData();

  return (
    <div className="h-full w-full flex flex-col gap-2">
      {conversations.data.map((c) => (
        <Link
          to="/conversations/$phoneId/$participantPhoneId"
          params={{
            phoneId: params.phoneId,
            participantPhoneId: c.participants.at(0)!,
          }}
        >
          <div
            key={c.id}
            className="flex flex-col gap-1 border-1 border-solid border-slate-400 rounded-sm py-2 px-4 hover:bg-slate-100"
          >
            <p>
              {c.participants.at(0)}
              {c.name ? ` (${c.name})` : null}
            </p>
            <p className="text-slate-500 text-xs">
              Latest message: {c.lastActivityAt}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
