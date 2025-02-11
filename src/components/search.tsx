"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  BookIcon,
  LoaderCircleIcon,
  RefreshCcwIcon,
  SearchIcon,
} from "lucide-react";
import { SearchBox, Hits, Highlight } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { type Hit as HitProps } from "instantsearch.js";
import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { client as algoliaClient } from "@/lib/algolia";
import { AlgoliaAttributes } from "@/types/algolia";
import { useSearchKeyboardEvents } from "@/hooks/use-search-keyboard-events";

const SearchContext = React.createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  open: false,
  setOpen: () => {},
});

function Hit({ hit }: { hit: HitProps<AlgoliaAttributes> }) {
  const router = useRouter();
  const { setOpen } = React.useContext(SearchContext);

  const handleClick = React.useCallback(
    async (evt: React.MouseEvent<HTMLAnchorElement>) => {
      evt.preventDefault();
      setOpen(false);

      router.push(evt.currentTarget.href);
    },
    [router, setOpen]
  );

  return (
    <Link
      onClick={handleClick}
      href={`/blog/${hit.objectID}`}
      className="inline-block p-4 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <BookIcon className="w-4 h-4" />
        <h3 className="text-lg font-bold">
          <Highlight<HitProps<AlgoliaAttributes>> attribute="title" hit={hit} />
        </h3>
      </div>

      <p className="text-slate-300 dark:text-slate-500 line-clamp-2">
        <Highlight<HitProps<AlgoliaAttributes>>
          attribute="description"
          hit={hit}
        />
      </p>
    </Link>
  );
}

function SearchPanel() {
  return (
    <InstantSearchNext
      insights
      searchClient={algoliaClient}
      indexName={process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME}
    >
      <SearchBox
        searchAsYouType
        placeholder="Search articles..."
        submitIconComponent={() => <SearchIcon className="w-6 h-6" />}
        resetIconComponent={() => <RefreshCcwIcon className="w-6 h-6" />}
        loadingIconComponent={() => (
          <LoaderCircleIcon className="w-6 h-6 animate-spin " />
        )}
        classNames={{
          root: cn("relative"),
          submit: cn("absolute left-3 top-1/2 -translate-y-1/2"),
          reset: cn("absolute right-3 top-1/2 -translate-y-1/2"),
          loadingIndicator: cn("absolute right-10 top-1/2 -translate-y-1/2"),
          input: cn(
            "flex h-16 w-full rounded-md border bg-slate-100 border-slate-200 hover:bg-slate-200 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800 px-12 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 dark:focus-visible:ring-slate-700 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-lg"
          ),
        }}
      />
      <Hits<AlgoliaAttributes>
        classNames={{
          root: cn("grid gap-4"),
          list: cn("flex flex-col gap-4 h-[480px] overflow-y-auto"),
        }}
        hitComponent={({ hit }) => <Hit hit={hit} />}
        bannerComponent={() => <Image src="/twitter-card.png" alt="banner" />}
      />
    </InstantSearchNext>
  );
}

export default function Search() {
  const searchButtonRef = React.useRef<HTMLButtonElement>(null);
  const [open, setOpen] = React.useState(false);

  useSearchKeyboardEvents({
    isOpen: open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    searchButtonRef,
  });

  return (
    <SearchContext.Provider value={{ open, setOpen }}>
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
        <DialogContent className="sm:max-w-3xl animation-none">
          <VisuallyHidden>
            <DialogHeader>
              <DialogTitle>Search</DialogTitle>
              <DialogDescription>
                Search through the content of this site.
              </DialogDescription>
            </DialogHeader>
          </VisuallyHidden>

          <SearchPanel />
        </DialogContent>
      </Dialog>
    </SearchContext.Provider>
  );
}
