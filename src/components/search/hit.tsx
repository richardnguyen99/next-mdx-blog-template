import React, { type JSX } from "react";
import Link, { type LinkProps } from "next/link";
import { type Hit as HitProps } from "instantsearch.js";
import { BookIcon } from "lucide-react";
import { Highlight } from "react-instantsearch";

import { cn } from "@/lib/utils";
import { type InternalSearchAlgoliaAttributes } from "@/types/algolia";

type InternalHitProps = Omit<LinkProps, "href"> & {
  hit: HitProps<InternalSearchAlgoliaAttributes>;
  ref?: React.Ref<HTMLAnchorElement>;
  active?: boolean;
};

function HitComponent({
  hit,
  active = false,
  ...rest
}: InternalHitProps): JSX.Element {
  return (
    <Link
      {...rest}
      href={`/blog/${hit.objectID}`}
      className={cn(
        "inline-block p-4 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors",
        active && "bg-slate-100 dark:bg-slate-800 dark:border-slate-700"
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <BookIcon className="w-4 h-4" />
        <h3 className="text-lg font-bold">
          <Highlight<HitProps<InternalSearchAlgoliaAttributes>>
            attribute="title"
            hit={hit}
          />
        </h3>
      </div>

      <p className="text-slate-300 dark:text-slate-500 line-clamp-2">
        <Highlight<HitProps<InternalSearchAlgoliaAttributes>>
          attribute="description"
          hit={hit}
        />
      </p>
    </Link>
  );
}

export default HitComponent;
