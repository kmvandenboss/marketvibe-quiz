'use client';
// src/components/analytics/dashboard/TrendsChart.tsx
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  
  interface TrendsChartProps {
    data: Array<{
      date: string;
      starts: number;
      completions: number;
      conversionRate: number;
    }>;
  }
  
  export function TrendsChart({ data }: TrendsChartProps) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Quiz Activity Trends</CardTitle>
          <CardDescription>
            Track quiz starts and completions over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="starts"
                  stroke="#8884d8"
                  name="Quiz Starts"
                />
                <Line
                  type="monotone"
                  dataKey="completions"
                  stroke="#82ca9d"
                  name="Completions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  }
  
 