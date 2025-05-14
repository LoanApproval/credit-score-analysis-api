
import React, { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import DashboardTabs from "@/components/DashboardTabs";
import { LoanApplication, PredictionResponse, AnalysisResult } from "@/types";
import { predictSingleLoan, uploadCSVForPrediction, analyzeCSV } from "@/api/loanApi";

const Index: React.FC = () => {
  const [predictionResults, setPredictionResults] = useState<PredictionResponse | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);

  const handleSingleApplicationSubmit = async (data: LoanApplication) => {
    setIsLoadingPrediction(true);
    try {
      const results = await predictSingleLoan(data);
      setPredictionResults(results);
      toast.success("Prediction completed successfully!");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process loan application");
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  const handleFileUploadPrediction = async (file: File) => {
    setIsLoadingPrediction(true);
    setCurrentFile(file);
    setCurrentPage(1);
    try {
      const results = await uploadCSVForPrediction(file, 1);
      setPredictionResults(results);
      toast.success("CSV file processed successfully!");
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to process CSV file");
    } finally {
      setIsLoadingPrediction(false);
    }
  };

  const handleFileUploadAnalysis = async (file: File) => {
    setIsLoadingAnalysis(true);
    try {
      const results = await analyzeCSV(file);
      setAnalysisResults(results);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to analyze CSV file");
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handlePageChange = async (page: number) => {
    if (currentFile && page !== currentPage) {
      setIsLoadingPrediction(true);
      setCurrentPage(page);
      try {
        const results = await uploadCSVForPrediction(currentFile, page);
        setPredictionResults(results);
      } catch (error) {
        console.error("Pagination error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to load page data");
      } finally {
        setIsLoadingPrediction(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <div className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Loan Approval Dashboard</h1>
          <p className="text-muted-foreground">
            Analyze and predict loan approvals using our machine learning model
          </p>
        </div>

        <DashboardTabs
          onSubmitSingleApplication={handleSingleApplicationSubmit}
          onFileUploadPrediction={handleFileUploadPrediction}
          onFileUploadAnalysis={handleFileUploadAnalysis}
          onPageChange={handlePageChange}
          predictionResults={predictionResults}
          analysisResults={analysisResults}
          isLoadingPrediction={isLoadingPrediction}
          isLoadingAnalysis={isLoadingAnalysis}
        />
      </div>
      <footer className="border-t py-6 bg-white">
        <div className="container text-center text-muted-foreground text-sm">
          © {new Date().getFullYear()} Loan Approval Dashboard. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
