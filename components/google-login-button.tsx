"use client";

import { createClient } from "@/lib/supabase/client";

export function GoogleLoginButton() {
  const handleLogin = async () => {
    const supabase = createClient();

    const redirectTo = `${window.location.origin}/auth/callback`;

    console.log("OAuth redirectTo:", redirectTo);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        skipBrowserRedirect: true,
      },
    });

    console.log("OAuth URL:", data.url);
    console.log("OAuth error:", error);

    if (data.url) {
      window.location.href = data.url;
    }
  };

  return (
    <button type="button" onClick={handleLogin}>
      Googleでログイン
    </button>
  );
}
