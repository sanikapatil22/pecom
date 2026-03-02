"use client";

import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
} from "recharts";

interface iAppProps {
  data: {
    date: string;
    revenue: number;
  }[];
}

const aggregateData = (data: any) => {
  const aggregated = data.reduce((acc: any, curr: any) => {
    if (acc[curr.date]) {
      acc[curr.date] += curr.revenue * 100;
    } else {
      acc[curr.date] = curr.revenue * 100;
    }
    return acc;
  }, {});

  return Object.keys(aggregated).map((date) => ({
    date,
    revenue: aggregated[date],
  }));
};

export function Chart({ data }: iAppProps) {
  const processedData = aggregateData(data);
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#a3a3a3" }}
          axisLine={{ stroke: "#e5e5e5" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#a3a3a3" }}
          axisLine={{ stroke: "#e5e5e5" }}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#000",
            border: "none",
            borderRadius: 0,
            color: "#fff",
            fontSize: 12,
          }}
          labelStyle={{ color: "#a3a3a3" }}
        />
        <Line
          type="monotone"
          stroke="#000"
          strokeWidth={2}
          activeDot={{ r: 5, fill: "#000", stroke: "#fff", strokeWidth: 2 }}
          dot={false}
          dataKey="revenue"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
