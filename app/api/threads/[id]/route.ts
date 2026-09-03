import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
    params: Promise<{
        id: string;
    }>;
}

export async function GET(_request: Request, { params }: RouteContext) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const { data: thread, error } = await supabase
    .from("threads")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to load thread:", error);

    return NextResponse.json(
      { error: "Failed to load thread" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    thread,
  });
}

export async function PATCH(
    request: Request,
    { params }: RouteContext,
) { 
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) { 
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

    const { id } = await params;

    const body = await request.json();

    const {
        title,
        status,
    }: {
        title?: string | null;
        status?: "regular" | "archived";
        } = body;

    const updates: {
        title?: string | null;
        status?: "regular" | "archived";
        updated_at: string;
    } = {
        updated_at: new Date().toISOString(),
    };

    if (title !== undefined) { 
        updates.title = title;
    }

    if (status !== undefined) { 
        updates.status = status;
    }

    const { data: thread, error } = await supabase
        .from("threads")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) { 
        console.error("Failed to update thread:", error);

        return NextResponse.json(
            { error: "Failed to update thread" },
            { status: 500 },
        );
    }

    return NextResponse.json({
        thread,
    })
}

export async function DELETE(
    _request: Request,
    { params }: RouteContext,
) {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 },
        );
    }

    const { id } = await params;

    const { error } = await supabase
        .from("threads")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Failed to delete thread:", error);

        return NextResponse.json(
            { error: "Failed to delete thread" },
            { status: 500 },
        );
    }

    return NextResponse.json({
        success: true,
    })
}