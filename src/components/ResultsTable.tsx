
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
import { LoanPrediction } from "@/types";

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
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
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
        <p className="text-muted-foreground">ไม่มีผลลัพธ์</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>อายุ</TableHead>
              <TableHead>รายได้</TableHead>
              <TableHead>วงเงินกู้</TableHead>
              <TableHead>คะแนนเครดิต</TableHead>
              <TableHead>ประวัติผิดนัด</TableHead>
              <TableHead>สถานะที่อยู่</TableHead>
              <TableHead>ผลลัพธ์</TableHead>
              <TableHead>ความน่าจะเป็น</TableHead>
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
                    {result.previous_defaults === "yes" ? "มี" : "ไม่มี"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {result.home_ownership === "own" ? "เจ้าของบ้าน" : 
                     result.home_ownership === "rent" ? "เช่า" : 
                     result.home_ownership === "mortgage" ? "จำนอง" : "อื่นๆ"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={result.result === "Approved" ? "success" : "destructive"}
                  >
                    {result.result === "Approved" ? "อนุมัติ" : "ปฏิเสธ"}
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
          แสดงผลลัพธ์ {((page - 1) * pagination.page_size) + 1} ถึง {Math.min(page * pagination.page_size, total_items)} จาก {total_items} รายการ
        </p>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            ก่อนหน้า
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= total_pages}
          >
            ถัดไป
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsTable;
