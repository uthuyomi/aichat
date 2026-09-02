"use client";

import type { ReactNode } from "react";
import { useTheme } from "next-themes";
import {
    ThemeProvider as OpenUiThemeProvider, createTheme
} from "@openuidev/react-ui";

type Props = {
    children: ReactNode;
};

const lightTheme = createTheme({});
const darkTheme = createTheme({});

export function OpenUiProvider({ children }: Props) {
    const { resolvedTheme } = useTheme();
    const mode = resolvedTheme === "dark" ? "dark" : "light";

    return (
        <OpenUiThemeProvider
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        mode={mode}
        >
            {children}
        </OpenUiThemeProvider>
    )
}