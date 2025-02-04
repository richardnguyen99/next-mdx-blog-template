"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuArrow } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  currentSort: string;
  currentSearchParams: URLSearchParams;
};

export function SortDropdown(props: Props) {
  const { currentSort, currentSearchParams } = props;

  const { push } = useRouter();

  const handleChange = React.useCallback(
    (value: string) => {
      const searchParams = new URLSearchParams(currentSearchParams);
      searchParams.set("sort", value);

      push(`/blog/?${searchParams.toString()}`, {
        scroll: false,
      });
    },
    [currentSearchParams, push]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full cursor-pointer">
          Sort
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side="bottom" align="end">
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={currentSort}
          onValueChange={handleChange}
        >
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="timeToRead">
            Time To Read
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>

        <DropdownMenuArrow className="dropdown-arrow" width="16" height="8" />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
