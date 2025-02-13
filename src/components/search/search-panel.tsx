"use client";

import React from "react";
import { useInstantSearch } from "react-instantsearch";
import { useRouter } from "next/navigation";

import SearchBox from "./search-box";
import SearchResult from "./search-result";
import SearchEmptyQueryBoundary from "./search-empty-boundary";
import SearchNoResultsBoundary from "./search-no-result-boundary";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function SearchPanel({ onClose }: Props): React.JSX.Element {
  const { results } = useInstantSearch();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const { push } = useRouter();

  const [activeHit, setActiveHit] = React.useState<number>(0);
  const hitRefs = React.useMemo(
    () =>
      Array.from({ length: results.hits.length }, () =>
        React.createRef<HTMLAnchorElement>()
      ),
    [results.hits]
  );

  const handleKeyDown = React.useCallback((evt: React.KeyboardEvent<HTMLDivElement>) => {
    const key = evt.key;

    if (key === "ArrowDown") {
      evt.preventDefault();

      const nextHit = activeHit + 1;
      if (nextHit < hitRefs.length) {
        setActiveHit(nextHit);
      }

    } else if (key === "ArrowUp") {
      evt.preventDefault();

      const prevHit = activeHit - 1;

      if (prevHit >= 0) {
        setActiveHit(prevHit);
      }

    } else if (key === "Enter") {
      evt.preventDefault();

      const hit = hitRefs[activeHit].current;
      if (hit) {
        onClose();
        push(hit.href);
      }
    } else {
      setActiveHit(0);
    }
  }, [activeHit, hitRefs, onClose, push]);

  return (
    <div
      ref={panelRef}
      className="flex flex-col gap-2 p-4 rounded-lg border border-border bg-background"
    >
      <div className="flex items-center justify-between mt-4 md:mt-0">
        <h2 className="text-lg font-semibold">Search</h2>
        <p className="text-sm text-slate-500">
          Search through the content of this site.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <SearchBox onKeyDown={handleKeyDown} />

        <SearchEmptyQueryBoundary fallback={null}>
          <SearchNoResultsBoundary>
            <SearchResult activeHit={activeHit} setActiveHit={setActiveHit} hitRefs={hitRefs} />
          </SearchNoResultsBoundary>
        </SearchEmptyQueryBoundary>
      </div>
    </div>
  );
}

export default React.memo(SearchPanel);
