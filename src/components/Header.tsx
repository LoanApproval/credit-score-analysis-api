
import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold text-primary">Loan Approval Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Documentation</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="cursor-pointer">
              API Documentation
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              User Guide
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              Model Information
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
