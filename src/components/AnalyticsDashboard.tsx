
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AnalysisResult } from "@/types";

interface AnalyticsDashboardProps {
  data: AnalysisResult | null;
  isLoading: boolean;
}

const COLORS = ["#0088FE", "#FF8042"];

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-5 w-3/4 rounded-md bg-muted"></div>
              <div className="h-4 w-1/2 rounded-md bg-muted"></div>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] rounded-md bg-muted"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-muted-foreground">
          Upload data to see analytics
        </p>
      </div>
    );
  }

  // Prepare data for home ownership chart
  const homeOwnershipData = Object.entries(data.approval_by_ownership).map(
    ([ownership, rates]) => ({
      name: ownership,
      approved: rates.Approved,
      declined: rates.Declined,
    })
  );

  // Prepare data for previous defaults chart
  const defaultsData = Object.entries(data.approval_by_defaults).map(
    ([defaultStatus, rates]) => ({
      name: defaultStatus,
      approved: rates.Approved,
      declined: rates.Declined,
    })
  );

  // Prepare data for pie chart
  const pieData = [
    { name: "Approved", value: (data.approval_rate / 100) * data.total_applications },
    {
      name: "Declined",
      value:
        ((100 - data.approval_rate) / 100) * data.total_applications,
    },
  ];

  // Prepare data for credit score chart
  const creditScoreData = data.credit_score_bins.labels.map((label, index) => ({
    name: label,
    approved: data.credit_score_bins.approved[index],
    declined: data.credit_score_bins.declined[index],
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Approval Rate</CardTitle>
          <CardDescription>
            Overall loan approval percentage: {data.approval_rate}%
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
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
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
              <YAxis tickFormatter={(value) => `${value}%`} />
              <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="approved" name="Approved" fill="#0088FE" />
              <Bar dataKey="declined" name="Declined" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Credit Score Distribution</CardTitle>
          <CardDescription>
            Approval rates by credit score range
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
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
