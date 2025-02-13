import React, { type JSX } from "react";
import { useInstantSearch } from "react-instantsearch";

type EmptyQueryBoundaryProps = {
  children: JSX.Element;
  fallback: React.ReactNode;
};

function SearchEmptyQueryBoundary({
  children,
  fallback,
}: EmptyQueryBoundaryProps): JSX.Element {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return children;
}

export default SearchEmptyQueryBoundary;
