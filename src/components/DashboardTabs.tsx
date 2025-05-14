
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanApplicationForm from "./LoanApplicationForm";
import FileUpload from "./FileUpload";
import ResultsTable from "./ResultsTable";
import AnalyticsDashboard from "./AnalyticsDashboard";
import { LoanApplication, PredictionResponse, AnalysisResult } from "@/types";

interface DashboardTabsProps {
  onSubmitSingleApplication: (data: LoanApplication) => void;
  onFileUploadPrediction: (file: File) => void;
  onFileUploadAnalysis: (file: File) => void;
  onPageChange: (page: number) => void;
  predictionResults: PredictionResponse | null;
  analysisResults: AnalysisResult | null;
  isLoadingPrediction: boolean;
  isLoadingAnalysis: boolean;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  onSubmitSingleApplication,
  onFileUploadPrediction,
  onFileUploadAnalysis,
  onPageChange,
  predictionResults,
  analysisResults,
  isLoadingPrediction,
  isLoadingAnalysis,
}) => {
  return (
    <Tabs defaultValue="single" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="single">ใบสมัครเดี่ยว</TabsTrigger>
        <TabsTrigger value="batch">การประมวลผลแบทช์</TabsTrigger>
        <TabsTrigger value="analytics">การวิเคราะห์</TabsTrigger>
      </TabsList>

      {/* Single Application Tab */}
      <TabsContent value="single" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoanApplicationForm
            onSubmit={onSubmitSingleApplication}
            isLoading={isLoadingPrediction}
          />
          {predictionResults && (
            <ResultsTable
              results={predictionResults.results}
              pagination={predictionResults.pagination}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </TabsContent>

      {/* Batch Processing Tab */}
      <TabsContent value="batch" className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FileUpload
            onFileSelected={onFileUploadPrediction}
            isLoading={isLoadingPrediction}
            accept=".csv"
          />
          {predictionResults && (
            <ResultsTable
              results={predictionResults.results}
              pagination={predictionResults.pagination}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </TabsContent>

      {/* Analytics Tab */}
      <TabsContent value="analytics" className="space-y-6">
        {analysisResults ? (
          <AnalyticsDashboard analysisData={analysisResults} />
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <FileUpload
              onFileSelected={onFileUploadAnalysis}
              isLoading={isLoadingAnalysis}
              accept=".csv"
            />
            <div className="p-8 text-center bg-muted rounded-lg">
              <h3 className="text-lg font-medium mb-2">ไม่มีข้อมูลการวิเคราะห์</h3>
              <p className="text-muted-foreground">
                อัพโหลดไฟล์ CSV เพื่อดูการวิเคราะห์และแผนภาพ
              </p>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
