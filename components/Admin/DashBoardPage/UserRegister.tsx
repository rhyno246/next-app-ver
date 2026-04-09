"use client";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@apollo/client/react";
import { GET_AUTHOR_REGISTER_IN_MONTH } from "@/graphql/queries";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthorRegisterInMonth {
  month: string;
  count: number;
}

interface AuthorRegisterInMonthData {
  authorRegisterInMonth: AuthorRegisterInMonth[];
}

const chartConfig = {
  count: {
    label: "Users",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export default function UserRegister() {
  const { data, loading } = useQuery<AuthorRegisterInMonthData>(
    GET_AUTHOR_REGISTER_IN_MONTH,
  );

  if (loading) return <Skeleton className="w-full h-[200px]" />;

  return (
    <ChartContainer config={chartConfig}>
      <AreaChart
        accessibilityLayer
        data={data?.authorRegisterInMonth ?? []}
        margin={{ left: 12, right: 12 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <defs>
          <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-count)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-count)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="count"
          type="natural"
          fill="url(#fillCount)"
          fillOpacity={0.4}
          stroke="var(--color-count)"
        />
      </AreaChart>
    </ChartContainer>
  );
}
