import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";
import useSocketEvent from "@/hooks/use-socket-event";

const chartConfig = {
  noOfReservations: {
    label: "No. of Reservations",
    color: "var(--chart-1)",
  },
};

const getMaxValue = (data, key) => {
  if (!data || !data.length) return 0;
  return Math.max(...data.map((d) => d[key]));
};

const ReservationsByLocationChart = () => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "/api/tenants/AB002/reservationsPerLocation"
      );
      const locationData = response.data.data;
      const formattedData = Object.entries(locationData).map(
        ([location, noOfReservations]) => ({
          location,
          noOfReservations,
        })
      );
      setChartData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useSocketEvent("new-booking", fetchData);


  const maxReservations = getMaxValue(chartData, "noOfReservations");
  const xDomainMax = Math.ceil((maxReservations * 1.1) / 10) * 10;

  return (
    <div className="w-full">
      <div className="pb-2 text-black/70 border-b-2">
        <h2 className="text-center font-semibold">Reservations by Location</h2>
        <p className="font-semibold text-left text-sm text-muted-foreground">No. of Reservations</p>
      </div>

      <ChartContainer config={chartConfig} className="h-[350px] w-full mx-auto">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            barSize={8}
            margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              dx={10}
              tick={{ fill: "#6B7280", fontSize: 12 }}
              domain={[0, xDomainMax]}
              allowDataOverflow={false}
              padding={{ right: 20 }}
            />
            <YAxis
              dataKey="location"
              type="category"
              axisLine={false}
              tickLine={false}
              dy={0}
              tick={{ fill: "#6B7280", fontSize: 12 }}
            />
            <ChartTooltip
              content={<ChartTooltipContent labelClassName="font-bold" />}
              cursor={false}
            />
            <Bar
              dataKey="noOfReservations"
              fill="#3b82f6"
              background={{ fill: "#eee", radius: 6 }}
              radius={[6, 6, 6, 6]}
              opacity={0.8}
              cursor={{ fill: "transparent" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};

export default ReservationsByLocationChart;
