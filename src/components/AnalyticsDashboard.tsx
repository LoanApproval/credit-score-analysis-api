
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
  analysisData: AnalysisResult;
}

const COLORS = ["#0088FE", "#FF8042"];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
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
          อัพโหลดข้อมูลเพื่อดูการวิเคราะห์
        </p>
      </div>
    );
  }

  // Prepare data for home ownership chart
  const homeOwnershipData = Object.entries(analysisData.approval_by_ownership).map(
    ([ownership, rates]) => ({
      name: ownership === 'own' ? 'เจ้าของบ้าน' : 
            ownership === 'rent' ? 'เช่า' : 
            ownership === 'mortgage' ? 'จำนอง' : 'อื่นๆ',
      approved: rates.Approved,
      declined: rates.Declined,
    })
  );

  // Prepare data for previous defaults chart
  const defaultsData = Object.entries(analysisData.approval_by_defaults).map(
    ([defaultStatus, rates]) => ({
      name: defaultStatus === 'yes' ? 'มี' : 'ไม่มี',
      approved: rates.Approved,
      declined: rates.Declined,
    })
  );

  // Prepare data for pie chart
  const pieData = [
    { name: "อนุมัติ", value: (analysisData.approval_rate / 100) * analysisData.total_applications },
    {
      name: "ปฏิเสธ",
      value:
        ((100 - analysisData.approval_rate) / 100) * analysisData.total_applications,
    },
  ];

  // Prepare data for credit score chart
  const creditScoreData = analysisData.credit_score_bins.labels.map((label, index) => ({
    name: label,
    approved: analysisData.credit_score_bins.approved[index],
    declined: analysisData.credit_score_bins.declined[index],
  }));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>อัตราการอนุมัติ</CardTitle>
          <CardDescription>
            อัตราการอนุมัติสินเชื่อทั้งหมด: {analysisData.approval_rate}%
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
          <CardTitle>ผลกระทบจากสถานะที่อยู่</CardTitle>
          <CardDescription>
            อัตราการอนุมัติตามสถานะที่อยู่อาศัย
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
              <Bar dataKey="approved" name="อนุมัติ" fill="#0088FE" />
              <Bar dataKey="declined" name="ปฏิเสธ" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>ผลกระทบจากประวัติผิดนัด</CardTitle>
          <CardDescription>
            อัตราการอนุมัติตามสถานะการผิดนัดชำระ
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
              <Bar dataKey="approved" name="อนุมัติ" fill="#0088FE" />
              <Bar dataKey="declined" name="ปฏิเสธ" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>การกระจายตัวของคะแนนเครดิต</CardTitle>
          <CardDescription>
            อัตราการอนุมัติตามช่วงคะแนนเครดิต
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
              <Bar dataKey="approved" name="อนุมัติ" fill="#0088FE" />
              <Bar dataKey="declined" name="ปฏิเสธ" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
