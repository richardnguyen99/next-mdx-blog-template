import { Search } from "lucide-react";
import React, { type JSX } from "react";
import { useInstantSearch } from "react-instantsearch";

interface NoResultsBoundaryProps {
  children: React.ReactElement;
}

function SearchNoResultsBoundary({
  children,
}: NoResultsBoundaryProps): JSX.Element {
  const { results, indexUiState } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full gap-4 p-4 text-center">
          <Search className="w-8 h-8 text-slate-500" />
          <p className="text-secondary-foreground">
            No results for <q className="font-bold text-foreground">{indexUiState.query}</q>.
          </p>
        </div>
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

export default SearchNoResultsBoundary;
