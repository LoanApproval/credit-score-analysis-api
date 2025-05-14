
import { AnalysisResult, LoanApplication, PredictionResponse } from "@/types";

// Replace with your actual API URL
const API_BASE_URL = "http://localhost:8080";

export async function predictSingleLoan(loanData: LoanApplication): Promise<PredictionResponse> {
  // Create a FormData with a single row CSV
  const formData = new FormData();
  
  // Create CSV header and data row
  const headers = ["income", "loan_amount", "loan_int_rate", "age", "previous_defaults", "home_ownership"];
  const row = [
    loanData.income,
    loanData.loan_amount,
    loanData.loan_int_rate,
    loanData.age,
    loanData.previous_defaults,
    loanData.home_ownership
  ];
  
  // Create a CSV string
  const csvContent = headers.join(",") + "\n" + row.join(",");
  
  // Convert the CSV string to a Blob and append to FormData
  const blob = new Blob([csvContent], { type: 'text/csv' });
  formData.append('file', blob, 'single_prediction.csv');
  
  // Make the request
  const response = await fetch(`${API_BASE_URL}/predict/csv`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${errorText}`);
  }
  
  return await response.json();
}

export async function uploadCSVForPrediction(
  file: File, 
  page: number = 1, 
  pageSize: number = 50
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const url = `${API_BASE_URL}/predict/csv?page=${page}&page_size=${pageSize}`;
  
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${errorText}`);
  }
  
  return await response.json();
}

export async function analyzeCSV(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/analyze/csv`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error: ${errorText}`);
  }
  
  return await response.json();
}
