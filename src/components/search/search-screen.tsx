import React, { type JSX } from "react";

import {
  InternalSearchHitWithParent,
  InternalSearchState,
} from "@/types/algolia";
import useMemoizedAutocomplete from "./use-autocomplete";
import ScreenResult from "./search-result";

type Props = ReturnType<typeof useMemoizedAutocomplete> & {
  state: InternalSearchState<InternalSearchHitWithParent>;
  onItemClick: (
    item: InternalSearchHitWithParent,
    event: MouseEvent | KeyboardEvent
  ) => void;
};

function SearchScreen(props: Props): JSX.Element {
  if (props.state.status === "error") {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-red-500">Error loading results</p>
      </div>
    );
  }

  const hasCollections = props.state.collections.some(
    (collection) => collection.items.length > 0
  );

  if (!props.state.query) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">Type to search...</p>
      </div>
    );
  }

  if (!hasCollections) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-gray-500">No results found</p>
      </div>
    );
  }

  return <ScreenResult {...props} />
}

export default React.memo(
  SearchScreen,
  function areEqual(_prevProps, nextProps) {
    return (
      _prevProps.state.isOpen === nextProps.state.isOpen &&
      _prevProps.state.query === nextProps.state.query &&
      (nextProps.state.status === "loading" ||
        nextProps.state.status === "stalled")
    );
  }
);
