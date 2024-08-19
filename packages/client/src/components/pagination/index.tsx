import {
  Pagination as PaginationRoot,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workout/ui";
import { MouseEvent, useMemo } from "react";

const FIRST_PAGE = 1;

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  changePage: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  changePage,
}) => {
  const handleNext = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      changePage(currentPage + 1);
    }
  };

  const handlePrevious = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    if (currentPage > FIRST_PAGE) {
      changePage(currentPage - 1);
    }
  };

  const shouldRenderMap = useMemo(
    () => ({
      firstEllipsis: currentPage > FIRST_PAGE + 1 && currentPage !== totalPages,
      secondEllipsis: currentPage < totalPages - 1,
      currentPaginateLink: currentPage > FIRST_PAGE && currentPage < totalPages,
      lastPaginateLink: totalPages > FIRST_PAGE,
    }),
    [currentPage, totalPages]
  );

  return (
    <PaginationRoot>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink isActive={currentPage === FIRST_PAGE}>
            {FIRST_PAGE}
          </PaginationLink>
        </PaginationItem>
        {shouldRenderMap.firstEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {shouldRenderMap.currentPaginateLink && (
          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>
        )}
        {shouldRenderMap.secondEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {shouldRenderMap.lastPaginateLink && (
          <PaginationItem>
            <PaginationLink isActive={currentPage === totalPages}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </PaginationRoot>
  );
};

export default Pagination;
