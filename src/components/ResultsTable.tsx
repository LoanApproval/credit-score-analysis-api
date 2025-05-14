
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoanPrediction, PaginationInfo } from "@/types";

interface ResultsTableProps {
  results: LoanPrediction[];
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  pagination,
  onPageChange,
}) => {
  // Format numbers with commas for thousands
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { page, total_pages } = pagination;
    const maxVisiblePages = 5;
    
    if (total_pages <= maxVisiblePages) {
      return Array.from({ length: total_pages }, (_, i) => i + 1);
    }
    
    // Always show first, last, current and pages around current
    const pageNumbers = [1];
    
    const startPage = Math.max(2, page - 1);
    const endPage = Math.min(total_pages - 1, page + 1);
    
    if (startPage > 2) {
      pageNumbers.push(-1); // Represents ellipsis
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (endPage < total_pages - 1) {
      pageNumbers.push(-2); // Represents ellipsis
    }
    
    if (total_pages > 1) {
      pageNumbers.push(total_pages);
    }
    
    return pageNumbers;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Prediction Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Age</TableHead>
                <TableHead>Income</TableHead>
                <TableHead>Loan Amount</TableHead>
                <TableHead>Credit Score</TableHead>
                <TableHead>Home Status</TableHead>
                <TableHead>Prior Defaults</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Probability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6">
                    No results to display. Upload a CSV file or submit the form.
                  </TableCell>
                </TableRow>
              ) : (
                results.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.age}</TableCell>
                    <TableCell>${formatNumber(item.income)}</TableCell>
                    <TableCell>${formatNumber(item.loan_amount)}</TableCell>
                    <TableCell>{item.credit_score}</TableCell>
                    <TableCell className="capitalize">
                      {item.home_ownership}
                    </TableCell>
                    <TableCell>{item.previous_defaults}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.result === "Approved" ? "success" : "destructive"
                        }
                        className="font-medium"
                      >
                        {item.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {item.approval_probability.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination.total_pages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
                  className={pagination.page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {getPageNumbers().map((pageNum, index) => (
                <PaginationItem key={index}>
                  {pageNum < 0 ? (
                    <span className="px-2">...</span>
                  ) : (
                    <PaginationLink
                      onClick={() => onPageChange(pageNum)}
                      isActive={pageNum === pagination.page}
                      className={pageNum === pagination.page ? "" : "cursor-pointer"}
                    >
                      {pageNum}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(pagination.total_pages, pagination.page + 1))}
                  className={pagination.page === pagination.total_pages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsTable;
