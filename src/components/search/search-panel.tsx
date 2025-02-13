"use client";

import React from "react";

import SearchBox from "./search-box";
import SearchResult from "./search-result";
import SearchEmptyQueryBoundary from "./search-empty-boundary";
import SearchNoResultsBoundary from "./search-no-result-boundary";

function SearchPanel(): React.JSX.Element {
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (panelRef && panelRef.current !== null) {
      console.log("Search panel ref", panelRef.current);
    }
  }, []);

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
        <SearchBox />

        <SearchEmptyQueryBoundary fallback={null}>
          <SearchNoResultsBoundary>
            <SearchResult />
          </SearchNoResultsBoundary>
        </SearchEmptyQueryBoundary>
      </div>
    </div>
  );
}

export default React.memo(SearchPanel);
