"use client";

import React from "react";
import { SearchIcon } from "lucide-react";

import { useSearchKeyboardEvents } from "@/hooks/use-search-keyboard-events";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { client as algoliaClient } from "@/lib/algolia";
import SearchPanel from "./search-panel";

function Search(): React.JSX.Element {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  useSearchKeyboardEvents({
    isOpen: open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    searchButtonRef,
  });

  React.useEffect(() => {
    console.log("Search button ref", searchButtonRef.current);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          ref={searchButtonRef}
          className={cn(
            buttonVariants({
              variant: "outline",
            }),
            "dark:bg-slate-800 dark:hover:bg-sky-900 dark:text-slate-200 dark:border-slate-700 dark:hover:border-sky-800 dark:hover:text-slate-50"
          )}
        >
          <SearchIcon className="w-4 h-4 mr-1" />
          Search articles...
        </Button>
      </DialogTrigger>

      <DialogContent className="block h-full bg-transparent border-transparent w-full max-h-full max-w-3xl [&>button]:block md:[&>button]:hidden">
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
          <SearchPanel />
        </InstantSearchNext>
      </DialogContent>
    </Dialog>
  );
}

export default Search;
