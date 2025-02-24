"use client";

import React, { type JSX } from "react";
import { LucideMonitor, MoonIcon } from "lucide-react";
import { SunIcon } from "@primer/octicons-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __theme: string;
    __onThemeChange: (theme: string) => void;
    __setPreferredTheme: (theme: string) => void;
  }
}

function ThemeSwitcher(): JSX.Element {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState("system");

  const handleThemeChange = React.useCallback((newTheme: string) => {
    window.__setPreferredTheme(newTheme);
  }, []);

  React.useEffect(() => {
    window.__onThemeChange = function () {
      setTheme(window.__theme);
    };

    // Fix hydration error
    setTheme(window.__theme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-md animate-pulse dark:bg-slate-800" />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "cursor-pointer",
            "dark:text-slate-200",
            "dark:hover:bg-sky-900"
          )}
          suppressHydrationWarning
        >
          {theme === "dark" ? (
            <MoonIcon className="h-4 w-4" />
          ) : theme === "light" ? (
            <SunIcon className="h-4 w-4" />
          ) : (
            <LucideMonitor className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup
          value={theme ?? "system"}
          onValueChange={handleThemeChange}
        >
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeSwitcher;
