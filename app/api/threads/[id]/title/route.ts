import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
    params: Promise<{
        id: string;
    }>
}

type TitleRequest = {
    text: string;
}

export async function POST(
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

    const { id: threadId } = await params;
    const { text }: TitleRequest = await request.json();

    if (!text?.trim()) { 
        return NextResponse.json(
            { error: "Text is required" },
            { status: 400 },
        );
    }

    const { text: title } = await generateText({
      model: openai("gpt-5.6-luna"),
      system:
        "Generate a short title for this conversation. " +
        "Return only the title with no quotes or explanation. " +
        "Use the same language as the conversation. " +
        "Keep it concise.",
      prompt: text,
    });

    const cleanTitle = title.trim().slice(0, 80);

    const { error } = await supabase
      .from("threads")
      .update({
        title: cleanTitle,
        updated_at: new Date().toISOString(),
      })
      .eq("id", threadId);

    if (error) {
      console.error("Failed to save thread title:", error);

      return NextResponse.json(
        { error: "Failed to save thread title" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      title: cleanTitle,
    });
}