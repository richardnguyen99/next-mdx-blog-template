import React from "react";

import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  rootUrl: string;
  queryName?: string;
  currentQueryString?: URLSearchParams;
};

export function Pagination({
  currentPage,
  totalPages,
  rootUrl,
  className,
  currentQueryString,
  queryName = "page",
  ...rest
}: React.ComponentProps<"nav"> & Props) {
  const pageUrl = (pageNumber: number) => {
    if (currentQueryString) {
      if (currentQueryString.has(queryName)) {
        currentQueryString.delete(queryName);
      }

      currentQueryString.set(queryName, pageNumber.toString());
      
      return `${rootUrl}?${currentQueryString}`;
    }

    return `${rootUrl}?${queryName}=${pageNumber}`;
  };

  return (
    <PaginationRoot className={className} {...rest}>
      <PaginationContent>
        <PaginationItem>
          {currentPage === 1 ? (
            <PaginationPrevious href={pageUrl(currentPage)} aria-disabled />
          ) : (
            <PaginationPrevious href={pageUrl(currentPage - 1)} />
          )}
        </PaginationItem>

        <PaginationItem>
          <PaginationLink href={pageUrl(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>

        {currentPage - 2 > 1 && <PaginationEllipsis />}

        {Array.from({ length: 3 }, (_, i) => i + currentPage - 1).map((i) =>
          i > 1 && i < totalPages ? (
            <PaginationItem key={i}>
              <PaginationLink href={pageUrl(i)} isActive={currentPage === i}>
                {i}
              </PaginationLink>
            </PaginationItem>
          ) : null
        )}

        {currentPage + 2 < totalPages && <PaginationEllipsis />}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href={pageUrl(totalPages)}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          {currentPage === totalPages ? (
            <PaginationNext href={pageUrl(totalPages)} aria-disabled />
          ) : (
            <PaginationNext href={pageUrl(currentPage + 1)} />
          )}
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}

export default Pagination;
