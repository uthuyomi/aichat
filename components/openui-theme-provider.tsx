"use client";

import type { ReactNode } from "react";
import {
    ThemeProvider as OpenUiThemeProvider, createTheme
} from "@openuidev/react-ui";

type Props = {
    children: ReactNode;
};

const lightTheme = createTheme({});

const darkTheme = createTheme({});

export function OpenUiProvider({children}: Props){
    return (
        <OpenUiThemeProvider
        lightTheme={lightTheme}
        darkTheme={darkTheme}
        >
            {children}
        </OpenUiThemeProvider>
    )
}