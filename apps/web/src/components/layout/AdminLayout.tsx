import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import AdminSidebar from "../AdminSidebar";

const AdminLayout = () => {
  const user = "Aman";
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <SidebarInset className="bg-neutral-900 flex-1 ">
          <header className="sticky top-0 z-50 w-full border-b border-zinc-800 backdrop-blur-lg transition-all">
            <div className="flex gap-3 h-14 items-center px-4">
              <SidebarTrigger />
              <div className="flex flex-1 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold">Admin Dashboard</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm">Welcome back, {user}</div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 space-y-4 p-4 md:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
