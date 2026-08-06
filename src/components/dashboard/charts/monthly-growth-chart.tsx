"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatKes } from "@/lib/utils";

export function MonthlyGrowthChart({ data }: { data: { month: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={{ stroke: "var(--border)" }} />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          width={40}
        />
        <Tooltip
          contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
          cursor={{ fill: "var(--muted)" }}
          formatter={(value) => [formatKes(Number(value)), "Revenue"]}
        />
        <Bar dataKey="revenue" fill="#7A294B" radius={[6, 6, 0, 0]} barSize={36} />
      </BarChart>
    </ResponsiveContainer>
  );
}
