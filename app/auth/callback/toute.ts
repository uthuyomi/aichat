import { NextResponse } from 'next/server';

import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);

    const code = requestUrl.searchParams.get("code");

    if (!code) { 
        return NextResponse.redirect(
            new URL("/?auth=error=missing_code", requestUrl.origin),
        );
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) { 
        console.error("OAuth callback error:", error);

        return NextResponse.redirect(
            new URL("/?auth_error=oauth_callback", requestUrl.origin),
        );
    }

    return NextResponse.redirect(new URL("/chat", requestUrl.origin));
}