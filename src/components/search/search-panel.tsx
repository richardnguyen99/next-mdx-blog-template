"use client";

import React from "react";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";

import { client as searchClient } from "@/lib/algolia";
import {
  InternalSearchHit,
  InternalSearchHitWithParent,
  InternalSearchState,
  InternalStoredSearchHit,
} from "@/types/algolia";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { File, Search } from "lucide-react";
import { createStoredSearches } from "./create-stored-searches";

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

  const autocomplete = React.useMemo(
    () =>
      createAutocomplete<
        InternalSearchHitWithParent,
        React.FormEvent<HTMLFormElement>,
        React.MouseEvent,
        React.KeyboardEvent
      >({
        id: "algolia-autocomplete",
        placeholder: "Search articles...",
        openOnFocus: true,
        defaultActiveItemId: 0,
        initialState: {
          query: "",
        },
        onStateChange({ state }) {
          // (2) Synchronize the Autocomplete state with the React state.
          setAutocompleteState(state);
        },
        navigator: {
          navigate({ itemUrl }) {
            push(itemUrl);
          },
        },
        getSources({ query }) {
          if (!query) {
            return [
              {
                sourceId: "recent searches",
                getItemUrl({ item }) {
                  return `/blog/${item.objectID}`;
                },
                getItems() {
                  return recentSearches.getAll() as InternalSearchHitWithParent[];
                },
                onSelect({ item, event }) {
                  saveRecentSearch(item);

                  if (!isModifierEvent(event)) {
                    onClose();
                  }
                },
              },
            ];
          }

          return [
            // (3) Use an Algolia index source.
            {
              sourceId: "article",
              getItemInputValue({ item }) {
                return item.query as string;
              },
              onSelect({ item, event }) {
                saveRecentSearch(item);

                if (!isModifierEvent(event)) {
                  onClose();
                }
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: indexName,
                      params: {
                        query,
                        hitsPerPage: 4,
                        highlightPreTag: "<mark>",
                        highlightPostTag: "</mark>",
                        snippetEllipsisText: "...",
                        attributesToRetrieve: [
                          "title",
                          "imageUrl",
                          "description",
                          "tags",
                          "headings",
                          "publishedAt",
                        ],
                        attributesToSnippet: ["description:20", "headings:20"],
                      },
                    },
                  ],
                });
              },
              getItemUrl({ item }) {
                return `/blog/${item.objectID}`;
              },
            },
          ];
        },
      }),
    [indexName, onClose, push, recentSearches, saveRecentSearch]
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

        <div className="ais-panel" {...autocomplete.getPanelProps({})}>
          {autocompleteState.isOpen &&
            autocompleteState.collections.map((collection, index) => {
              const { source, items } = collection;

              return (
                <div key={`source-${index}`} className="ais-source">
                  <h3 className="ais-source-id">{source.sourceId}</h3>

                  {items.length > 0 && (
                    <ul
                      className="ais-source-list"
                      {...autocomplete.getListProps()}
                    >
                      {items.map((item) => {
                        const itemProps = autocomplete.getItemProps({
                          item,
                          source,
                          onClick: () => {
                            push(`/blog/${item.objectID}`);
                            onClose();
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
      </div>
    </div>
  );
}

export default SearchPanel;

/**
 * Detect when an event is modified with a special key to let the browser
 * trigger its default behavior.
 */
export function isModifierEvent<TEvent extends KeyboardEvent | MouseEvent>(
  event: TEvent
): boolean {
  const isMiddleClick = (event as MouseEvent).button === 1;

  return (
    isMiddleClick ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey
  );
}
