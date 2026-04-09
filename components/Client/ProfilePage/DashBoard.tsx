"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import { GET_ME, GET_WEEKLY_ORDERS } from "@/graphql/queries";
import { MeResponse } from "@/types/type";
import { useQuery } from "@apollo/client/react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

type WeeklyOrder = {
  day: string;
  orders: number;
};

type WeeklyOrdersResponse = {
  weeklyOrders: WeeklyOrder[];
};

const chartConfig = {
  desktop: {
    label: "Order",
    color: "#3c50e0",
  },
} satisfies ChartConfig;
export default function DashBoard() {
  const { data: userData } = useQuery<MeResponse>(GET_ME);
  const user = userData?.me;
  const { data, loading } = useQuery<WeeklyOrdersResponse>(GET_WEEKLY_ORDERS, {
    variables: { authorId: user?.id },
    skip: !user?.id,
  });
  const chartData = data?.weeklyOrders ?? [];
  if (loading) return <Spinner />;
  return (
    <>
      <h1 className="mb-4 text-xl uppercase font-bold">Order in month</h1>
      <ChartContainer config={chartConfig} className="w-full">
        <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          <Line
            dataKey="orders"
            type="linear"
            stroke="var(--color-desktop)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </>
  );
}
