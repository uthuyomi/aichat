import { Thread } from "@/components/thread";
import MyRuntimeProvider from "./MyRuntimeProvider";

export default function Home() {
  return (
    <MyRuntimeProvider>
      <Thread />
    </MyRuntimeProvider>
  )
}
