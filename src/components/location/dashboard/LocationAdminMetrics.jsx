import { useState, useEffect } from "react";
import StatsCard from "@/components/common/StatsCard";
import { useSelector } from "react-redux";
import locationApi from "@/config/locationApi";
import useSocketEvent from "@/hooks/use-socket-event";

const defaultMetrics = {
  bookings: {
    count: 0,
    bookings: [],
    comparison: {
      percentageChange: "0.00%",
      trend: "increase",
      yesterdayCount: 0
    }
  },
  occupancy: {
    totalTables: 0,
    occupiedToday: 0,
    occupancyRate: "0.00%",
    comparison: {
      yesterdayOccupied: 0,
      yesterdayRate: "0.00%",
      change: "0.00%",
      trend: "increase"
    }
  },
  noShows: {
    noShowsToday: 0,
    totalTodayBookings: 0,
    rate: "0.00%",
    comparison: {
      yesterdayNoShows: 0,
      yesterdayRate: "0.00%",
      change: "0.00%",
      trend: "increase"
    }
  }
};

const LocationAdminMetrics = () => {
  const [metricsData, setMetricsData] = useState(defaultMetrics);

  const locationId = useSelector(state => state.auth?.userData?.locationId);

  const fetchMetrics = async () => {
    if (!locationId) return;
    try {
      const response = await locationApi.get(`/${locationId}/dailyMetrics`);
      // The API returns { success, data, meta }
      if (response && response.success && response.data) {
        setMetricsData(response.data);
      } else {
        setMetricsData(defaultMetrics);
      }
    } catch (error) {
      console.error("Error fetching location admin metrics:", error);
      setMetricsData(defaultMetrics);
    }
  };
  useEffect(() => {
    fetchMetrics();
  }, []);

  useSocketEvent("new-booking", fetchMetrics);

  const stats = [
    {
      id: 1,
      stat: metricsData.bookings?.count ?? 0,
      heading: "Total Reservations today",
      isIncrease: metricsData.bookings?.comparison?.trend === "increase",
      percentage: metricsData.bookings?.comparison?.percentageChange ?? "0.00%"
    },
    {
      id: 2,
      stat: metricsData.occupancy?.occupancyRate ?? "0.00%",
      heading: "Seat - Occupancy Rate",
      isIncrease: metricsData.occupancy?.comparison?.trend === "increase",
      percentage: metricsData.occupancy?.comparison?.change ?? "0.00%"
    },
    {
      id: 3,
      stat: metricsData.noShows?.rate ?? "0.00%",
      heading: "No Show Rate",
      isIncrease: metricsData.noShows?.comparison?.trend === "increase",
      percentage: metricsData.noShows?.comparison?.change ?? "0.00%"
    }
  ];

  return (
    <>
      {stats.map((stat) => (
        <StatsCard
          key={stat.id}
          stat={stat.stat}
          heading={stat.heading}
          isIncrease={stat.isIncrease}
          percentage={stat.percentage}
          className="col-span-12 sm:col-span-4 xl:col-span-3"
        />
      ))}
    </>
  );
};

export default LocationAdminMetrics;
