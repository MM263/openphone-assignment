import { SidebarProvider } from "@/common/components/ui/sidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: () => (
    <SidebarProvider>
      <Outlet />
      <TanStackRouterDevtools />
    </SidebarProvider>
  ),
});
