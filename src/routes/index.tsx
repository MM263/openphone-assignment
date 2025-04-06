import OpenPhoneClient from "@/common/api/client";
import { PhoneNumbersResponse } from "@/common/api/types";
import { AppSidebar } from "@/common/components/AppSidebar";
import { Header } from "@/common/components/Header";
import { Collapsible } from "@/common/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/common/components/ui/sidebar";
import { CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Minus } from "lucide-react";

export const Route = createFileRoute("/")({
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
            <Collapsible
              key={pn.id}
              defaultOpen={false}
              className="group/collapsible"
            >
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <span>
                    {pn.symbol} {pn.formattedNumber}
                  </span>
                  <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                  <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </Collapsible>
          ))}
        </SidebarGroup>
      </AppSidebar>
      <SidebarInset>
        <Header />
        <div className="px-4 py-4">
          <div>hello world</div>
        </div>
      </SidebarInset>
    </>
  );
}
