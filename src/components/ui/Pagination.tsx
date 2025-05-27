import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../utils/cn';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}) => {
  const renderPageNumbers = () => {
    const pages = [];
    // Always show first page
    pages.push(
      <PageButton
        key={1}
        page={1}
        isActive={currentPage === 1}
        onClick={() => onPageChange(1)}
      />
    );

    // If there are many pages, use ellipsis
    if (totalPages > 7) {
      if (currentPage > 3) {
        pages.push(
          <div key="ellipsis-1" className="mx-1 flex items-center justify-center">
            <span className="text-gray-400">...</span>
          </div>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <PageButton
            key={i}
            page={i}
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          />
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(
          <div key="ellipsis-2" className="mx-1 flex items-center justify-center">
            <span className="text-gray-400">...</span>
          </div>
        );
      }
    } else {
      // Show all pages if there are not many
      for (let i = 2; i < totalPages; i++) {
        pages.push(
          <PageButton
            key={i}
            page={i}
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          />
        );
      }
    }

    // Always show last page if there is more than 1 page
    if (totalPages > 1) {
      pages.push(
        <PageButton
          key={totalPages}
          page={totalPages}
          isActive={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
        />
      );
    }

    return pages;
  };

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className={cn('flex items-center justify-center space-x-1', className)}>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => canGoPrevious && onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Previous page"
        className="px-2.5"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center">
        {renderPageNumbers()}
      </div>
      
      <Button
        size="sm"
        variant="ghost"
        onClick={() => canGoNext && onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Next page"
        className="px-2.5"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
}

const PageButton: React.FC<PageButtonProps> = ({ page, isActive, onClick }) => {
  return (
    <Button
      size="sm"
      variant={isActive ? "primary" : "ghost"}
      className={cn(
        "min-w-[2rem] h-8 px-2.5 mx-0.5",
        isActive && "pointer-events-none"
      )}
      onClick={onClick}
    >
      {page}
    </Button>
  );
};