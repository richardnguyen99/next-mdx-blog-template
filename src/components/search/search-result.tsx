import React, { type JSX } from "react";
import Image from "next/image";
import { Hits } from "react-instantsearch";

import { type AlgoliaAttributes } from "@/types/algolia";
import { cn } from "@/lib/utils";
import HitComponent from "./hit";

function SearchResult(): JSX.Element {
  return (
    <Hits<AlgoliaAttributes>
      classNames={{
        root: cn("h-full mt-8"),
        list: cn("flex flex-col gap-4 max-h-full overflow-y-auto"),
      }}
      hitComponent={({ hit }) => <HitComponent hit={hit} />}
      bannerComponent={() => <Image src="/twitter-card.png" alt="banner" />}
    />
  );
}

export default SearchResult;
