import OpenPhoneClient from "@/common/api/client";
import { FormattedDate } from "@/common/components/FormattedDate";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/conversations/$phoneId/")({
  loader: async ({ params: { phoneId } }) => {
    try {
      const client = OpenPhoneClient.getInstance();

      const conversations = await client.listConversations({
        phoneNumbers: [phoneId],
      });

      return conversations.data.sort((a, b) =>
        new Date(a.updatedAt ?? a.createdAt!) >
        new Date(b.updatedAt ?? b.createdAt!)
          ? -1
          : 1,
      );
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
    <div className="h-full w-full flex flex-col gap-2 ">
      {conversations.map((c) => (
        <Link
          to="/conversations/$phoneId/$participantPhoneId"
          params={{
            phoneId: params.phoneId,
            participantPhoneId: c.participants.at(0)!,
          }}
        >
          <div
            key={c.id}
            className="flex flex-col gap-1 rounded-sm py-2 px-4 bg-slate-50 max-w-2xl hover:bg-slate-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
          >
            <p>
              {c.participants.at(0)}
              {c.name ? ` (${c.name})` : null}
            </p>
            <p className="text-slate-500 text-xs">
              Latest message:{" "}
              <FormattedDate dateString={c.updatedAt ?? c.createdAt!} />
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
