import OpenPhoneClient from "@/common/api/client";
import { PhoneNumbersResponse } from "@/common/api/types";
import { AppSidebar } from "@/common/components/AppSidebar";
import { Header } from "@/common/components/Header";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenuButton,
} from "@/common/components/ui/sidebar";
import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/conversations")({
  loader: async () => {
    try {
      const client = OpenPhoneClient.getInstance();

      const phoneNumbers = await client.listPhoneNumbers();

      return phoneNumbers;
    } catch (error) {
      console.error("Failed to load phone numbers:", error);
      throw new Error("Failed to load phone numbers");
    }
  },
  component: Index,
});

function Index() {
  const phoneNumbers = Route.useLoaderData() as PhoneNumbersResponse;

  return (
    <>
      <AppSidebar>
        <SidebarGroup>
          <SidebarGroupLabel>Your phone numbers</SidebarGroupLabel>
          {phoneNumbers.data.map((pn) => (
            <Link
              to="/conversations/$phoneId"
              params={{
                phoneId: pn.id,
              }}
            >
              <SidebarMenuButton key={pn.id} className="cursor-pointer">
                {pn.symbol} {pn.name}{" "}
                <span className="text-slate-500">{pn.formattedNumber}</span>
              </SidebarMenuButton>
            </Link>
          ))}
        </SidebarGroup>
      </AppSidebar>
      <SidebarInset>
        <Header>Conversations</Header>
        <div className="flex px-4 py-4 h-full w-full justify-center items-center">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}
