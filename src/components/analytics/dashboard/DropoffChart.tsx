 'use client';
 // src/components/analytics/dashboard/DropoffChart.tsx
 import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  interface DropoffChartProps {
    data: Array<{
      step: string;
      count: number;
    }>;
  }
  
  export function DropoffChart({ data }: DropoffChartProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Drop-off Analysis</CardTitle>
          <CardDescription>
            See where users are leaving the quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="step" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" name="Drop-offs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
  
 