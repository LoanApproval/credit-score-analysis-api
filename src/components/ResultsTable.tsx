
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LoanResult } from "@/types";

interface ResultsTableProps {
  results: LoanResult[];
  pagination: {
    page: number;
    page_size: number;
    total_items: number;
    total_pages: number;
  };
  onPageChange: (page: number) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ResultsTable: React.FC<ResultsTableProps> = ({
  results,
  pagination,
  onPageChange,
}) => {
  const { page, total_pages, total_items } = pagination;
  
  if (results.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No results to display.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Age</TableHead>
              <TableHead>Income</TableHead>
              <TableHead>Loan Amount</TableHead>
              <TableHead>Credit Score</TableHead>
              <TableHead>Previous Defaults</TableHead>
              <TableHead>Home Ownership</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Probability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.age}</TableCell>
                <TableCell>{formatCurrency(result.income)}</TableCell>
                <TableCell>{formatCurrency(result.loan_amount)}</TableCell>
                <TableCell>{result.credit_score}</TableCell>
                <TableCell>
                  <Badge
                    variant={result.previous_defaults === "yes" ? "destructive" : "outline"}
                  >
                    {result.previous_defaults}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{result.home_ownership}</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={result.result === "Approved" ? "success" : "destructive"}
                  >
                    {result.result}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${result.approval_probability}%` }}
                      ></div>
                    </div>
                    <span className="text-xs">
                      {result.approval_probability}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing results {((page - 1) * pagination.page_size) + 1} to {Math.min(page * pagination.page_size, total_items)} of {total_items}
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= total_pages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
