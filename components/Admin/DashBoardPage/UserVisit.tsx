"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useQuery } from "@apollo/client/react";
import { Spinner } from "@/components/ui/spinner";
import { BrowserVisitStat, BrowserVisitStatsData } from "@/types/type";
import { GET_STATS } from "@/graphql/queries";

const COLORS: Record<string, string> = {
  chrome: "var(--chart-1)",
  safari: "var(--chart-2)",
  firefox: "var(--chart-3)",
  edge: "var(--chart-4)",
  opera: "var(--chart-5)",
  other: "var(--chart-5)",
};

const chartConfig = {
  visitors: { label: "Visitors" },
  chrome: { label: "Chrome", color: "var(--chart-1)" },
  safari: { label: "Safari", color: "var(--chart-2)" },
  firefox: { label: "Firefox", color: "var(--chart-3)" },
  edge: { label: "Edge", color: "var(--chart-4)" },
  other: { label: "Other", color: "var(--chart-5)" },
} satisfies ChartConfig;

export default function UserVisit() {
  const { data, loading } = useQuery<BrowserVisitStatsData>(GET_STATS);
  const chartData = React.useMemo(() => {
    if (!data?.browserVisitStats) return [];
    return data.browserVisitStats.map((item: BrowserVisitStat) => ({
      browser: item.browser,
      visitors: item.count,
      fill: COLORS[item.browser] ?? COLORS.other,
    }));
  }, [data]);

  const totalVisitors = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.visitors, 0),
    [chartData],
  );

  if (loading) return <Spinner />;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>User visit Chart</CardTitle>
        <CardDescription>Browser distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Visitors
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Live browser tracking <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing visits by browser type
        </div>
      </CardFooter>
    </Card>
  );
}
