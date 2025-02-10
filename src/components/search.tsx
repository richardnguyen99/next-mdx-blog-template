import { LoaderCircleIcon, RefreshCcwIcon, SearchIcon } from "lucide-react";
import { SearchBox, RefinementList, Hits } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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

function SearchPanel() {
  return (
    <InstantSearchNext
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
      <RefinementList attribute="category" />
      <Hits />
    </InstantSearchNext>
  );
}

export default function Search() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
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
      <DialogContent className="sm:max-w-[678px] animation-none">
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
  );
}
