
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnalysisResult } from "@/types";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsDashboardProps {
  analysisData: AnalysisResult;
}

const COLORS = ["#0088FE", "#FF8042"];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analysisData,
}) => {
  if (!analysisData) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">
          Upload data to view analytics
        </p>
      </div>
    );
  }

  // Prepare data for home ownership chart - ensure all required properties exist
  const homeOwnershipData = Object.entries(analysisData.approval_by_ownership || {}).map(
    ([ownership, rates]) => ({
      name: ownership === 'own' ? 'Own' : 
            ownership === 'rent' ? 'Rent' : 
            ownership === 'mortgage' ? 'Mortgage' : 'Other',
      approved: rates.Approved || 0,
      declined: rates.Declined || 0,
    })
  );

  // Prepare data for previous defaults chart
  const defaultsData = Object.entries(analysisData.approval_by_defaults || {}).map(
    ([defaultStatus, rates]) => ({
      name: defaultStatus === 'yes' ? 'Yes' : 'No',
      approved: rates.Approved || 0,
      declined: rates.Declined || 0,
    })
  );

  // Prepare data for pie chart
  const pieData = [
    { name: "Approved", value: (analysisData.approval_rate / 100) * analysisData.total_applications },
    {
      name: "Declined",
      value:
        ((100 - analysisData.approval_rate) / 100) * analysisData.total_applications,
    },
  ];

  // Prepare data for Loan Interest Rate chart
  const creditScoreData = analysisData.credit_score_bins?.labels?.map((label, index) => ({
    name: label,
    approved: analysisData.credit_score_bins.approved?.[index] || 0,
    declined: analysisData.credit_score_bins.declined?.[index] || 0,
  })) || [];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Approval Rate</CardTitle>
          <CardDescription>
            Overall loan approval rate: {analysisData.approval_rate}%
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => Math.round(Number(value))} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Home Ownership Impact</CardTitle>
          <CardDescription>
            Approval rates by home ownership status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={homeOwnershipData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value*100}%`} />
              <Tooltip formatter={(value) => `${(Number(value)*100).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="approved" name="Approved" fill="#0088FE" />
              <Bar dataKey="declined" name="Declined" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Previous Defaults Impact</CardTitle>
          <CardDescription>
            Approval rates by previous defaults status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={defaultsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${value*100}%`} />
              <Tooltip formatter={(value) => `${(Number(value)*100).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="approved" name="Approved" fill="#0088FE" />
              <Bar dataKey="declined" name="Declined" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Loan Interest Rate Distribution</CardTitle>
          <CardDescription>
            Approval rates by loan int rate range
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={creditScoreData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" name="Approved" fill="#0088FE" />
              <Bar dataKey="declined" name="Declined" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default AnalyticsDashboard;
