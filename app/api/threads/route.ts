import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    const { data: threads, error } = await supabase
        .from("threads")
        .select("*")
        .order("updated_at", { ascending: false });

    if (error) {
        console.error("Failed to load threads:", error);

        return NextResponse.json(
            { error: "Failed to load threads" },
            { status: 500 },
        )
    }

    return NextResponse.json({
        threads,
    });
}

export async function POST() {
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

    const threadId = crypto.randomUUID();

    const { data: thead, error } = await supabase
        .from("threads")
        .insert({
            id: threadId,
            user_id: user.id,
            title: null,
            status: "regular",
        })
        .select()
        .single();

    if (error) {
        console.error("Failed to create thread:", error);

        return NextResponse.json(
            { error: "Failed to create thread" },
            { status: 500 },
        );
    }

    return NextResponse.json(
        { thread: thead },
        { status: 201 },
    );
}