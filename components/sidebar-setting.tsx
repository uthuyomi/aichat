"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function SidebarSetting() {
    const { theme, setTheme } = useTheme();

    return (
        <div className="px-2 py-3">
      <div className="text-sm font-semibold">
        Settings
      </div>

      <div className="mt-4">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          Appearance
        </div>

        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setTheme("system")}
            className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs hover:bg-sidebar-accent ${
              theme === "system" ? "bg-sidebar-accent" : ""
            }`}
          >
            <Monitor className="size-4" />
            <span>System</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("light")}
            className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs hover:bg-sidebar-accent ${
              theme === "light" ? "bg-sidebar-accent" : ""
            }`}
          >
            <Sun className="size-4" />
            <span>Light</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme("dark")}
            className={`flex flex-col items-center gap-1 rounded-md p-2 text-xs hover:bg-sidebar-accent ${
              theme === "dark" ? "bg-sidebar-accent" : ""
            }`}
          >
            <Moon className="size-4" />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </div>
    );
}