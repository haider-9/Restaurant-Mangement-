import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const chartData = [
  {
    type: "reservations",
    customers: 650,
    fill: "var(--color-reservations)",
  },
  {
    type: "walkins",
    customers: 350,
    fill: "var(--color-walkins)",
  },
];

const chartConfig = {
  customers: {
    label: "Customers",
  },
  reservations: {
    label: "Reservations",
    color: "#6640FF",
  },
  walkins: {
    label: "Walk-ins",
    color: "#fd0000",
  },
};

const ReservationChart = () => {
  const totalCustomers = chartData.reduce(
    (acc, curr) => acc + curr.customers,
    0
  );

  return (
    <Card className="h-full w-full  mx-auto">
      <CardHeader>
        <CardTitle className="text-black/70">Customer Distribution</CardTitle>
      </CardHeader>
      <CardContent className="min-h-full flex items-center justify-center">
        <ChartContainer
          config={chartConfig}
          className=" [&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[250px] pb-0 h-full w-full"
        >
          <PieChart width={250} height={250}>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  hideIndicator={false}
                  formatter={(value, name) => [
                    `${value} customers (${(
                      (value / totalCustomers) *
                      100
                    ).toFixed(1)}%)`,
                    chartConfig[name]?.label || name,
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="customers"
              nameKey="type"
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={1}
              label={(entry) => chartConfig[entry.type]?.label}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ReservationChart;
