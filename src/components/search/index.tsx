"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { InstantSearchNext } from "react-instantsearch-nextjs";

import { useSearchKeyboardEvents } from "@/hooks/use-search-keyboard-events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { client as algoliaClient } from "@/lib/algolia";
import SearchPanel from "./search-panel";

function Search(): React.JSX.Element {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, []);

  useSearchKeyboardEvents({
    isOpen: open,
    onOpen: handleOpen,
    onClose: handleClose,
    searchButtonRef,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          ref={searchButtonRef}
          variant="outline"
          className={cn(
            "cursor-pointer",
            "dark:bg-slate-800 dark:hover:bg-sky-900",
            "dark:text-slate-200 dark:hover:text-slate-50",
            "dark:border-slate-700 dark:hover:border-sky-800",
            "bg-slate-100 hover:bg-slate-200"
          )}
        >
          <SearchIcon className="w-4 h-4 mr-1" />
          Search articles...
        </Button>
      </DialogTrigger>

      <DialogContent
        className={cn(
          "block h-full w-full max-h-full max-w-3xl",
          "bg-transparent border-transparent",
          "[&>button]:block md:[&>button]:hidden"
        )}
      >
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Search</DialogTitle>
            <DialogDescription>
              Search through the content of this site.
            </DialogDescription>
          </DialogHeader>
        </VisuallyHidden>

        <InstantSearchNext
          insights
          searchClient={algoliaClient}
          indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
        >
          <SearchPanel onOpen={handleOpen} onClose={handleClose} isOpen />
        </InstantSearchNext>
      </DialogContent>
    </Dialog>
  );
}

export default Search;
