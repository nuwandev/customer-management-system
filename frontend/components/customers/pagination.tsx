"use client";

import { Button } from "@/components/ui/button";

import { Select } from "@/components/ui/select";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFirst: boolean;
  isLast: boolean;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isFirst,
  isLast,
  pageSize,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={isFirst}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={isLast}
        >
          Next
        </Button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-700 w-full">
            Page <span className="font-medium">{currentPage + 1}</span> of{" "}
            <span className="font-medium">{totalPages}</span>
          </p>
          <Select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="w-32 ml-2"
            aria-label="Rows per page"
          >
            {[10, 25, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option} per page
              </option>
            ))}
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={isFirst}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={isLast}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
