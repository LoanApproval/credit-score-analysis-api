
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalysisResult } from "@/types";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

interface AnalyticsDashboardProps {
  analysisData: AnalysisResult;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analysisData,
}) => {
  // Colors for charts
  const COLORS = {
    approved: "#10b981", // success/green
    declined: "#ef4444", // destructive/red
    blue: "#3b82f6",
    purple: "#8b5cf6",
    orange: "#f97316",
    yellow: "#eab308",
  };

  // Format numbers with commas for thousands
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US");
  };

  // Prepare data for pie charts
  const prepareOwnershipData = () => {
    const { approval_by_ownership } = analysisData;
    return Object.entries(approval_by_ownership).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value["Approved"] || 0,
      total: 100,
    }));
  };

  // Prepare data for credit score chart
  const prepareCreditScoreData = () => {
    const { credit_score_bins } = analysisData;
    return credit_score_bins.labels.map((label, index) => ({
      name: label,
      Approved: credit_score_bins.approved[index],
      Declined: credit_score_bins.declined[index],
    }));
  };

  // Calculate stats for dashboard cards
  const getAverageIncome = () => {
    const approved = analysisData.income_distribution.approved;
    return approved && approved.mean ? approved.mean : 0;
  };

  const getAverageLoanAmount = () => {
    const approved = analysisData.loan_amount_distribution.approved;
    return approved && approved.mean ? approved.mean : 0;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Summary Cards */}
      <Card className="dashboard-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Total Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {formatNumber(analysisData.total_applications)}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            {analysisData.approval_rate.toFixed(1)}% approval rate
          </p>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Average Approved Income</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">${formatNumber(getAverageIncome())}</div>
          <p className="text-muted-foreground text-sm mt-1">
            For approved applications
          </p>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Average Loan Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            ${formatNumber(getAverageLoanAmount())}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            For approved applications
          </p>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">
            Credit Score Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {analysisData.credit_score_distribution?.approved?.mean
              ? analysisData.credit_score_distribution.approved.mean.toFixed(0)
              : "N/A"}
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Average credit score (approved)
          </p>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle>Credit Score Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prepareCreditScoreData()} barGap={4}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value as number)} />
                <Legend />
                <Bar
                  dataKey="Approved"
                  fill={COLORS.approved}
                  name="Approved"
                />
                <Bar
                  dataKey="Declined"
                  fill={COLORS.declined}
                  name="Declined"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval by Home Ownership</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={prepareOwnershipData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  {prepareOwnershipData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        Object.values(COLORS)[
                          index % Object.values(COLORS).length
                        ]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Approval by Previous Defaults</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "No Defaults",
                      value:
                        analysisData.approval_by_defaults["no"]?.["Approved"] ||
                        0,
                    },
                    {
                      name: "Has Defaults",
                      value:
                        analysisData.approval_by_defaults["yes"]?.["Approved"] ||
                        0,
                    },
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                >
                  <Cell fill={COLORS.blue} />
                  <Cell fill={COLORS.orange} />
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
