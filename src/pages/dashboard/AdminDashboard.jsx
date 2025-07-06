import StatsCard from "./components/StatsCard";
import {
  dummyStats,
  dummyUpdates,
  supadmincolumns,
  supadmin,
} from "./constants";
import DashboardLayout from "./components/DashboardLayout";
import Updates from "./components/Updates";
import DemandTrendChart from "./components/DemandTrendChart";
import ReservationChart from "./components/ReservationChart";
import TablePicture from "./components/TablePicture";

const AdminDashboard = () => {
  return (
    <DashboardLayout title={"Admin Dashboard"}>
      <div className="grid grid-cols-12 xl:grid-cols-13 m-4 gap-4 *:rounded-lg">
        <title>Admin Dashboard</title>
        <div className="col-span-12 lg:col-span-4 xl:col-span-9 grid grid-cols-subgrid gap-2">
          {dummyStats.map((stat) => (
            <StatsCard
              key={stat.id}
              stat={stat.stat}
              heading={stat.heading}
              isIncrease={stat.isIncreased}
              percentage={stat.percentage}
              className="col-span-4 xl:col-span-3"
            />
          ))}
        </div>
        <div className="row-start-3 lg:row-start-2 xl:row-start-1 col-span-6 xl:col-span-4 xl:col-start-10 xl:row-span-3">
          <Updates updates={dummyUpdates} />
        </div>
        <div className="flex items-center justify-center col-span-12 lg:col-span-6 xl:col-span-5 xl:row-span-2 min-h-52">
          <DemandTrendChart />
        </div>
        <div className="flex items-center justify-center col-span-12 lg:col-span-6 xl:col-span-4 xl:row-span-2 min-h-52">
          <ReservationChart />
        </div>
        <div className="col-span-12 xl:col-span-13">
          <TablePicture
            columns={supadmincolumns}
            data={supadmin}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
