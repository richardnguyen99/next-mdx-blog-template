import React, { type JSX } from "react";
import { Search, File } from "lucide-react";

import useMemoizedAutocomplete from "./use-autocomplete";
import {
  InternalSearchHitWithParent,
  InternalSearchState,
} from "@/types/algolia";

type Props = ReturnType<typeof useMemoizedAutocomplete> & {
  state: InternalSearchState<InternalSearchHitWithParent>;
  onItemClick: (
    item: InternalSearchHitWithParent,
    event: MouseEvent | KeyboardEvent
  ) => void;
};

function SearchResult({ state, onItemClick, ...rest }: Props): JSX.Element {
  return (
    <div className="ais-panel" {...rest.getPanelProps({})}>
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
                        {source.sourceId === "article" ? <File /> : <Search />}
                        <span>{item.title}</span>
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

export default SearchResult;
