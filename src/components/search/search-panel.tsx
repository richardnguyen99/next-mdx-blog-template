"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import {
  InternalSearchHit,
  InternalSearchHitWithParent,
  InternalSearchState,
  InternalStoredSearchHit,
} from "@/types/algolia";
import { cn } from "@/lib/utils";
import { createStoredSearches } from "./create-stored-searches";
import useMemoizedAutocomplete, { isModifierEvent } from "./use-autocomplete";
import SearchScreen from "./search-screen";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

function SearchPanel({ onClose }: Props): React.JSX.Element {
  const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME as string;

  const { push } = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [autocompleteState, setAutocompleteState] = React.useState<
    InternalSearchState<InternalSearchHitWithParent>
  >({
    query: "",
    isOpen: false,
    activeItemId: null,
    collections: [],
    status: "idle",
    context: {},
    completion: null,
  });

  const favoriteSearches = React.useRef(
    createStoredSearches<InternalStoredSearchHit>({
      key: `__AUTOCOMPLETE_FAVORITE_SEARCHES__${indexName}`,
      limit: 10,
    })
  ).current;

  const recentSearches = React.useRef(
    createStoredSearches<InternalStoredSearchHit>({
      key: `__AUTOCOMPLETE_RECENT_SEARCHES__${indexName}`,
      // We display 7 recent searches and there's no favorites, but only
      // 4 when there are favorites.
      limit: favoriteSearches.getAll().length === 0 ? 7 : 4,
    })
  ).current;



  const saveRecentSearch = React.useCallback(
    function saveRecentSearch(item: InternalSearchHit) {
      if (
        item &&
        favoriteSearches
          .getAll()
          .findIndex((x) => x.objectID === item.objectID) === -1
      ) {
        recentSearches.add(item);
      }
    },
    [favoriteSearches, recentSearches]
  );

  const autocomplete = useMemoizedAutocomplete(
    autocompleteState,
    setAutocompleteState,
    indexName,
    onClose,
    recentSearches,
    saveRecentSearch,
    push
  );

  return (
    <div className="ais">
      <div className="ais-header">
        <h2 className="text-lg font-semibold">Search</h2>
        <p className="text-sm text-slate-500">
          Search through the content of this site.
        </p>
      </div>

      <div className="ais-container">
        <form
          className="ais-form"
          {...autocomplete.getFormProps({ inputElement: inputRef.current })}
        >
          <Search className="ais-svg" />
          <input
            ref={inputRef}
            className={cn("ais-search")}
            {...(autocomplete.getInputProps({
              inputElement: inputRef.current!,
              autoFocus: true,
            }) as unknown as React.InputHTMLAttributes<HTMLInputElement>)}
          />
        </form>

        <SearchScreen
          {...autocomplete}
          state={autocompleteState}
          recentSearches={recentSearches}
          onItemClick={(item, evt) => {
            saveRecentSearch(item);
            push(`/blog/${item.objectID}`);

            if (!isModifierEvent(evt)) {
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
}

export default SearchPanel;
