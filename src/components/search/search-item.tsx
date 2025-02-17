import React, { type JSX } from "react";
import { InternalAutocompleteSource } from "@algolia/autocomplete-core";

import useMemoizedAutocomplete from "./use-autocomplete";
import {
  InternalSearchHitWithParent,
  InternalSearchState,
} from "@/types/algolia";
import { cn } from "@/lib/utils";

type Props = ReturnType<typeof useMemoizedAutocomplete> & {
  index: number;
  state: InternalSearchState<InternalSearchHitWithParent>;
  item: InternalSearchHitWithParent;
  source: InternalAutocompleteSource<InternalSearchHitWithParent>;
  hasCollections: boolean;
  onItemClick: (
    item: InternalSearchHitWithParent,
    event: MouseEvent | KeyboardEvent
  ) => void;
  renderIcon: (props: {
    item: InternalSearchHitWithParent;
    index: number;
  }) => JSX.Element;

  renderAction: (props: {
    item: InternalSearchHitWithParent;
    deleteTransitionCallback: (cb: () => void) => void;
    favoriteTransitionCallback: (cb: () => void) => void;
  }) => JSX.Element;
};

function SearchItem(props: Props): JSX.Element {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isFavoriting, setIsFavoriting] = React.useState(false);
  const action = React.useRef<(() => void) | null>(null);
  const itemProps = props.getItemProps({
    item: props.item,
    source: props.source,
    onClick: (event: KeyboardEvent | MouseEvent) => {
      props.onItemClick(props.item, event);
    },
  });

  const deleteTransitionCallback = (cb: () => void) => {
    setIsDeleting(true);
    action.current = cb;
  };

  const favoriteTransitionCallback = (cb: () => void) => {
    setIsFavoriting(true);
    action.current = cb;
  };

  return (
    <li
      key={props.item.objectID}
      className={cn("ais-source-item", {
        "ais-source-item--deleting": isDeleting,
        "ais-source-item--favoriting": isFavoriting,
      })}
      {...itemProps}
      onTransitionEnd={() => {
        if (action.current) {
          action.current();
          action.current = null;
        }
      }}
    >
      {props.renderIcon({ item: props.item, index: props.index })}
      <span>{props.item.title}</span>

      {props.renderAction({
        item: props.item,
        deleteTransitionCallback,
        favoriteTransitionCallback,
      })}
    </li>
  );
}

export default SearchItem;
