"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatKes } from "@/lib/utils";

export function SalesTrendChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7A294B" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#7A294B" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          interval={4}
          tickLine={false}
          axisLine={{ stroke: "var(--border)" }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => `${Math.round(v / 1000)}k`}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            fontSize: 12,
          }}
          labelStyle={{ color: "var(--foreground)", fontWeight: 600 }}
          formatter={(value) => [formatKes(Number(value)), "Revenue"]}
        />
        <Area type="monotone" dataKey="revenue" stroke="#7A294B" strokeWidth={2} fill="url(#salesFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
