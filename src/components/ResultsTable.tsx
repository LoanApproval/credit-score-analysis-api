
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoanPrediction } from "@/types";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

interface ResultsTableProps {
  results: LoanPrediction[];
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
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Sort results based on current sorting criteria
  const sortedResults = [...results].sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField as keyof LoanPrediction];
    const fieldB = b[sortField as keyof LoanPrediction];
    
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const SortIndicator = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
      <ArrowDown className="ml-1 h-4 w-4 inline" />;
  };
  
  if (results.length === 0) {
    return (
      <div className="rounded-lg border bg-card p-8 text-center">
        <p className="text-muted-foreground">No results available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("age")} className="cursor-pointer">
                Age <SortIndicator field="age" />
              </TableHead>
              <TableHead onClick={() => handleSort("income")} className="cursor-pointer">
                Income <SortIndicator field="income" />
              </TableHead>
              <TableHead onClick={() => handleSort("loan_amount")} className="cursor-pointer">
                Loan Amount <SortIndicator field="loan_amount" />
              </TableHead>
              <TableHead onClick={() => handleSort("loan_int_rate")} className="cursor-pointer">
                Loan Interest Rate <SortIndicator field="loan_int_rate" />
              </TableHead>
              <TableHead onClick={() => handleSort("loadn_percent_income")} className="cursor-pointer">
                Loan Percent Income <SortIndicator field="loadn_percent_income" />
              </TableHead>
              <TableHead onClick={() => handleSort("previous_defaults")} className="cursor-pointer">
                Previous Defaults <SortIndicator field="previous_defaults" />
              </TableHead>
              <TableHead onClick={() => handleSort("home_ownership")} className="cursor-pointer">
                Home Ownership <SortIndicator field="home_ownership" />
              </TableHead>
              <TableHead onClick={() => handleSort("result")} className="cursor-pointer">
                Result <SortIndicator field="result" />
              </TableHead>
              <TableHead onClick={() => handleSort("approval_probability")} className="cursor-pointer">
                Probability <SortIndicator field="approval_probability" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.age}</TableCell>
                <TableCell>{formatCurrency(result.income)}</TableCell>
                <TableCell>{formatCurrency(result.loan_amount)}</TableCell>
                <TableCell>{result.loan_int_rate}%</TableCell>
                <TableCell>{result.loan_percent_income*100}%</TableCell>
                <TableCell>
                  <Badge
                    variant={result.previous_defaults === "yes" ? "destructive" : "outline"}
                  >
                    {result.previous_defaults === "yes" ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {result.home_ownership === "own" ? "Own" : 
                     result.home_ownership === "rent" ? "Rent" : 
                     result.home_ownership === "mortgage" ? "Mortgage" : "Other"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={result.result === "Approved" ? "success" : "destructive"}
                  >
                    {result.result === "Approved" ? "Approved" : "Declined"}
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
                      {result.approval_probability.toFixed(2)}%
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
          Showing results {((page - 1) * pagination.page_size) + 1} to {Math.min(page * pagination.page_size, total_items)} of {total_items} entries
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
