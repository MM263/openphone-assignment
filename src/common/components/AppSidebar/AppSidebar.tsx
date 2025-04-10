import { CircleDotDashed } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
} from "../ui/sidebar";

interface SidebarProps {
  children?: React.ReactNode;
}
export function AppSidebar({ children }: SidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <span>
                <CircleDotDashed className="h-5 w-5" />
                <span className="text-base font-semibold">OpenPhone</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>{children}</SidebarContent>
    </Sidebar>
  );
}
