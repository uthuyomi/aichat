import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type StoredMessage = {
  id: string;
  parent_id: string | null;
  format: string;
  content: unknown;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: threadId } = await params;

  const { data: messages, error } = await supabase
    .from("messages")
    .select("id, parent_id, format, content, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load messages:", error);

    return NextResponse.json(
      { error: "Failed to load messages" },
      { status: 500 },
    );
  }

  return NextResponse.json(messages);
}

export async function POST(request: Request, { params }: RouteContext) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: threadId } = await params;

  const body: StoredMessage = await request.json();

  const { id, parent_id, format, content } = body;

  if (!id || !format || content === undefined) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const { error } = await supabase.from("messages").upsert(
    {
      id,
      thread_id: threadId,
      parent_id,
      format,
      content,
    },
    {
      onConflict: "id",
    },
  );

  if (error) {
    console.error("Failed to insert message:", error);

    return NextResponse.json(
      { error: "Failed to insert message" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
