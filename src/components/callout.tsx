"use client";

import React, { type JSX } from "react";
import { ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

type Props = React.PropsWithChildren<
  React.ComponentProps<"div"> & {
    variant: "info" | "warning" | "danger" | "success" | "default";
    heading: string;
    collapsible?: boolean;
  }
>;

function Callout(props: Props): JSX.Element {
  const [isOpen, setIsOpen] = React.useState(props.collapsible ?? false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn("space-y-2 mb-8", "border border-border rounded-lg", {
        "border-lime-500 dark:border-lime-400": props.variant === "success",
        "border-blue-500 dark:border-blue-400": props.variant === "info",
        "border-yellow-500 dark:border-yellow-400": props.variant === "warning",
        "border-red-500 dark:border-red-400": props.variant === "danger",
      })}
    >
      <div className="flex items-center justify-between space-x-4 px-4 mt-2">
        <h4
          className={cn("font-semibold not-prose", {
            "text-lime-500 dark:text-lime-400": props.variant === "success",
            "text-blue-500 dark:text-blue-400": props.variant === "info",
            "text-yellow-500 dark:text-yellow-400": props.variant === "warning",
            "text-red-500 dark:text-red-400": props.variant === "danger",
          })}
        >
          {props.heading}
        </h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2 px-4 text-sm">
        {props.children}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default Callout;
