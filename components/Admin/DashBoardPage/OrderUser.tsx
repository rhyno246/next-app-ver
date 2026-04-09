"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_MONTHLY_ORDERS } from "@/graphql/queries";
import { useQuery } from "@apollo/client/react";

interface MonthlyOrder {
  month: string;
  orders: number;
  revenue: number;
}

interface MonthlyOrdersData {
  monthlyOrders: MonthlyOrder[];
}

const chartConfig = {
  orders: {
    label: "Orders",
    color: "#2563eb",
  },
  revenue: {
    label: "Revenue",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

export default function OrderUser() {
  const { data, loading } = useQuery<MonthlyOrdersData>(GET_MONTHLY_ORDERS);

  if (loading) return <Skeleton className="min-h-[200px] w-full" />;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data?.monthlyOrders ?? []}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="orders" fill="var(--color-orders)" radius={4} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
