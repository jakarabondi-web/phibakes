"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatKes } from "@/lib/utils";

export function RevenueCategoryChart({ data }: { data: { category: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="category"
          tick={{ fontSize: 10.5, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={50}
        />
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
        <Bar dataKey="revenue" fill="#C69A5B" radius={[6, 6, 0, 0]} barSize={32} />
      </BarChart>
    </ResponsiveContainer>
  );
}
