import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@repo/ui/components/sidebar";
import { BarChart3, Code2, LayoutDashboard, Users } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

const AdminSidebar = () => {
  const items = [
    { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
    { title: "Problems", url: "/admin/problems", icon: Code2 },
    { title: "Users", url: "/admin/users", icon: Users },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
  ];

  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <Sidebar className="border-r border-zinc-800 bg-neutral-900 text-zinc-50">
      <SidebarContent className="bg-neutral-900 p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-zinc-50">Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="h-10">
                  <SidebarMenuButton
                    asChild
                    isActive={currentPath.endsWith(item.url)}
                  >
                    <NavLink to={item.url}>
                      <item.icon className="size-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AdminSidebar;
