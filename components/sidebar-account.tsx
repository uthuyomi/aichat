"use client";

import { useEffect, useState } from "react";
import { Setting, X } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import { 
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

export function SidebarAccount() { 
    const [user, setUser] = useState<User | null>(null);
    const [settingsOpen, setSettingOpen] = useState(false);

    useEffect(() => { 
        const supabase = createClient();

       
    }, []);
}