import React, { type JSX } from "react";
import Image from "next/image";
import { Hits } from "react-instantsearch";

import { type AlgoliaAttributes } from "@/types/algolia";
import { cn } from "@/lib/utils";
import HitComponent from "./hit";

type Props = {
  hitRefs: React.RefObject<HTMLAnchorElement | null>[];
  activeHit: number;
  setActiveHit: (hit: number) => void;
};

function SearchResult({ hitRefs, activeHit }: Props): JSX.Element {
  return (
    <Hits<AlgoliaAttributes>
      classNames={{
        root: cn("h-full mt-8"),
        list: cn("flex flex-col gap-4 max-h-full overflow-y-auto"),
      }}
      hitComponent={({ hit }) => (
        <HitComponent
          ref={(el) => {
            const position = hit.__position - 1;

            if (el) {
              if (hit.__position >= 0 && hit.__position < hitRefs.length) {
                hitRefs[position].current = el;
              }
            }
          }}
          hit={hit}
          active={activeHit === hit.__position - 1}
        />
      )}
      bannerComponent={() => <Image src="/twitter-card.png" alt="banner" />}
    />
  );
}

export default SearchResult;
