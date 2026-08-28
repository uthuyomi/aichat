import { Thread } from "@/components/thread";
import MyRuntimeProvider from "./MyRuntimeProvider";
import { ThreadListSidebar } from "@/components/threadlist-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <MyRuntimeProvider>
      <SidebarProvider>
        <ThreadListSidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <SidebarTrigger />
          <div className="min-h-0 flex-1">
            <Thread />
          </div>
        </main>
      </SidebarProvider>
    </MyRuntimeProvider>
  );
}
