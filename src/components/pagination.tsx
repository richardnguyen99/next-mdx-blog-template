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
};

export function Pagination({
  currentPage,
  totalPages,
  rootUrl,
  className,
  queryName = "page",
  ...rest
}: React.ComponentProps<"nav"> & Props) {
  return (
    <PaginationRoot className={className} {...rest}>
      <PaginationContent>
        <PaginationItem>
          {currentPage === 1 ? (
            <PaginationPrevious href={`${rootUrl}?${queryName}=1`} aria-disabled />
          ) : (
            <PaginationPrevious
              href={`${rootUrl}?${queryName}=${currentPage - 1}`}
            />
          )}
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            href={`${rootUrl}/?${queryName}=1`}
            isActive={currentPage === 1}
          >
            1
          </PaginationLink>
        </PaginationItem>

        {currentPage - 2 > 1 && <PaginationEllipsis />}

        {Array.from({ length: 3 }, (_, i) => i + currentPage - 1).map((i) =>
          i > 1 && i < totalPages ? (
            <PaginationItem key={i}>
              <PaginationLink
                href={`${rootUrl}/?${queryName}=${i}`}
                isActive={currentPage === i}
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          ) : null
        )}

        {currentPage + 2 < totalPages && <PaginationEllipsis />}

        {totalPages > 1 && (
          <PaginationItem>
            <PaginationLink
              href={`${rootUrl}/?${queryName}=${totalPages}`}
              isActive={currentPage === totalPages}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem>
          {currentPage === totalPages ? (
            <PaginationNext href={`${rootUrl}?${queryName}=${totalPages}`} aria-disabled />
          ) : (
            <PaginationNext href={`${rootUrl}?${queryName}=${currentPage + 1}`} />
          )}
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
}

export default Pagination;

