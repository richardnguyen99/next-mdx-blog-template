import React, { type JSX } from "react";
import { History, Star, X } from "lucide-react";

import useMemoizedAutocomplete from "./use-autocomplete";
import {
  InternalSearchHitWithParent,
  InternalSearchState,
  InternalStoredSearchHit,
} from "@/types/algolia";
import { Button } from "@/components/ui/button";
import SearchItem from "./search-item";
import { StoredSearchPlugin } from "./create-stored-searches";

type Props = ReturnType<typeof useMemoizedAutocomplete> & {
  state: InternalSearchState<InternalSearchHitWithParent>;
  recentSearches: StoredSearchPlugin<InternalStoredSearchHit>
  onItemClick: (
    item: InternalSearchHitWithParent,
    event: MouseEvent | KeyboardEvent
  ) => void;
  hasCollections: boolean;
};

function SearchRecent({
  state,
  onItemClick,
  ...rest
}: Props): JSX.Element | null {
  if (state.status === "idle" && !rest.hasCollections) {
    return (
      <div className="ais-panel ais-recent text-center my-4">
        <p className="text-lg">No recent searches</p>
      </div>
    );
  }

  if (!rest.hasCollections) {
    return null;
  }

  
  return (
    <div className="ais-panel ais-recent" {...rest.getPanelProps({})}>
      {state.isOpen &&
        state.collections.map((collection, index) => {
          const { source, items } = collection;

          return (
            <div key={`source-${index}`} className="ais-source">
              <h3 className="ais-source-id">{source.sourceId}</h3>

              {items.length > 0 && (
                <ul className="ais-source-list" {...rest.getListProps()}>
                  {items.map((item) => {

                    return (
                      <SearchItem 
                        key={item.objectID}
                        item={item}
                        index={index}
                        state={state}
                        source={source}
                        onItemClick={onItemClick}
                        renderIcon={() => (
                          <History className="w-4 h-4 text-gray-500" />
                        )}
                        renderAction={({ deleteTransitionCallback, favoriteTransitionCallback }) => (
                          <React.Fragment>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ais-action ais-favorite"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              favoriteTransitionCallback(() => {
                                console.log("Favorite action triggered");
                              });
                            }}
                          >
                            <Star />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ais-action ais-remove"
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();

                              deleteTransitionCallback(() => {
                                rest.recentSearches.remove(item);
                                rest.refresh();
                              });
                            }}
                          >
                            <X />
                          </Button>
                          </React.Fragment>
                        )}
                        {...rest}
                      />
                    )
                  })}
                </ul>
              )}
            </div>
          );
        })}
    </div>
  );
}

export default SearchRecent;
