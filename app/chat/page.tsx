import { Thread } from "@/components/thread";
import MyRuntimeProvider from "./MyRuntimeProvider";
import  sidebar from ""

export default function Home() {
  return (
    <MyRuntimeProvider>
      <div className="flex hscreen">
        <Sidebar />
      </div>
      <Thread />
    </MyRuntimeProvider>
  );
}
