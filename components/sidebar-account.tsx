"use client";

import { useEffect, useState } from "react";
import { Settings, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { 
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarSetting } from "@/components/sidebar-setting";

import Image from "next/image";

export function SidebarAccount() { 
    const [user, setUser] = useState<User | null>(null);
    const [settingsOpen, setSettingOpen] = useState(false);

    useEffect(() => { 
        const supabase = createClient();

       async function loadUser() {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        setUser(user);
       }

       loadUser();
    }, []);

    if(!user) {
        return null;
    }

    const avatarUrl =  user.user_metadata.avatar_url;
    const email = user.email;

    return (
        <div className="flex flex-col gap-2">
      {settingsOpen && (
        <SidebarSetting />
      )}

      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center">
            <SidebarMenuButton size="lg" className="flex-1">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt=""
                  className="size-8 rounded-full"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="size-8 rounded-full bg-sidebar-primary" />
              )}

              <div className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium">
                  {email}
                </span>
                <span className="block text-xs text-muted-foreground">
                  Google Account
                </span>
              </div>
            </SidebarMenuButton>

            <button
              type="button"
              onClick={() => setSettingOpen((open) => !open)}
              className="flex size-8 items-center justify-center rounded-md hover:bg-sidebar-accent"
              aria-label="設定"
            >
              {settingsOpen ? (
                <X className="size-4" />
              ) : (
                <Settings className="size-4" />
              )}
            </button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>  
    );
}