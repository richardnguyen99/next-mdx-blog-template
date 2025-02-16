import React, { type JSX } from "react";
import { History, Star, X } from "lucide-react";

import useMemoizedAutocomplete from "./use-autocomplete";
import {
  InternalSearchHitWithParent,
  InternalSearchState,
} from "@/types/algolia";
import { Button } from "@/components/ui/button";

type Props = ReturnType<typeof useMemoizedAutocomplete> & {
  state: InternalSearchState<InternalSearchHitWithParent>;
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
      <div className="ais-panel ais-recent">
        <p>No recent searches</p>
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
                    const itemProps = rest.getItemProps({
                      item,
                      source,
                      onClick: (event: KeyboardEvent | MouseEvent) => {
                        onItemClick(item, event);
                      },
                    });

                    return (
                      <li
                        key={item.objectID}
                        className="ais-source-item"
                        {...itemProps}
                      >
                        <History />
                        <span>{item.title}</span>

                        <Button variant="outline" size="icon" className="ais-action ais-favorite">
                          <Star />
                        </Button>
                        <Button variant="outline" size="icon" className="ais-action ais-remove">
                          <X />
                        </Button>
                      </li>
                    );
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
