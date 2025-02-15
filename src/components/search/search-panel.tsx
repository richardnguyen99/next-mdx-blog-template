"use client";

import React from "react";
import { createAutocomplete } from "@algolia/autocomplete-core";
import { getAlgoliaResults } from "@algolia/autocomplete-preset-algolia";

import { client as searchClient } from "@/lib/algolia";
import {
  InternalSearchHitWithParent,
  InternalSearchState,
} from "@/types/algolia";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { File, Search } from "lucide-react";

type Props = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

function SearchPanel({ onClose }: Props): React.JSX.Element {
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
            onClose();
          },
        },
        getSources({ query }) {
          if (!query) {
            return [];
          }

          return [
            // (3) Use an Algolia index source.
            {
              sourceId: "article",
              getItemInputValue({ item }) {
                return item.query as string;
              },
              getItems({ query }) {
                return getAlgoliaResults({
                  searchClient,
                  queries: [
                    {
                      indexName: process.env
                        .NEXT_PUBLIC_ALGOLIA_INDEX_NAME as string,
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
    [onClose, push]
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
                            {source.sourceId === "article" && (
                              <File />
                            )}
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
