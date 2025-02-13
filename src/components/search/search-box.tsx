"use client";

import React, { type JSX } from "react";
import { LoaderCircleIcon, RefreshCcwIcon, SearchIcon } from "lucide-react";
import { SearchBox as InstantSearchBox } from "react-instantsearch";

import { cn } from "@/lib/utils";

function SearchBox(): JSX.Element {
  const ref = React.useRef<HTMLDivElement>(null);

  const handleKeyDown = React.useCallback((evt: React.KeyboardEvent) => {
    const key = evt.key;

    if (key === "ArrowDown") {
      evt.preventDefault();
      console.log("Arrow down pressed");
    } else if (key === "ArrowUp") {
      evt.preventDefault();
      console.log("Arrow up pressed");
    } else if (key === "Enter") {
      evt.preventDefault();
      console.log("Enter pressed");
    }
  }, []);

  React.useEffect(() => {
    if (ref && ref.current !== null) {
      console.log("Search box ref", ref.current);
    }
  }, []);

  return (
    <InstantSearchBox
      autoFocus
      searchAsYouType
      placeholder="Search articles..."
      submitIconComponent={() => <SearchIcon className="w-6 h-6" />}
      resetIconComponent={() => <RefreshCcwIcon className="w-6 h-6" />}
      loadingIconComponent={() => (
        <LoaderCircleIcon className="w-6 h-6 animate-spin " />
      )}
      classNames={{
        root: cn("relative w-full h-16 mt-4 md:mt-0"),
        submit: cn("absolute left-3 top-1/2 -translate-y-1/2"),
        reset: cn("absolute right-3 top-1/2 -translate-y-1/2"),
        loadingIndicator: cn("absolute right-10 top-1/2 -translate-y-1/2"),
        input: cn(
          "flex h-16 w-full rounded-md border bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800 px-12 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 dark:focus-visible:ring-slate-700 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
        ),
      }}
      onKeyDown={handleKeyDown}
    />
  );
}

export default SearchBox;
