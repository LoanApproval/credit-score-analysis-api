
export interface LoanApplication {
  income: number;
  loan_amount: number;
  credit_score: number;
  age: number;
  previous_defaults: string;
  home_ownership: string;
}

export interface LoanPrediction extends LoanApplication {
  result: "Approved" | "Declined";
  approval_probability: number;
}

export interface PaginationInfo {
  page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface PredictionResponse {
  results: LoanPrediction[];
  pagination: PaginationInfo;
}

export interface AnalysisResult {
  total_applications: number;
  approval_rate: number;
  approval_by_ownership: Record<string, Record<string, number>>;
  counts_by_ownership: Record<string, Record<string, number>>;
  approval_by_defaults: Record<string, Record<string, number>>;
  counts_by_defaults: Record<string, Record<string, number>>;
  age_distribution: {
    approved: Record<string, number>;
    declined: Record<string, number>;
  };
  income_distribution: {
    approved: Record<string, number>;
    declined: Record<string, number>;
  };
  credit_score_bins: {
    labels: string[];
    approved: number[];
    declined: number[];
  };
  loan_amount_distribution: {
    approved: Record<string, number>;
    declined: Record<string, number>;
  };
}
