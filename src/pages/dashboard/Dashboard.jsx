import StatsCard from "./components/StatsCard";
import {
  dummyStats,
  dummyUpdates,
  TableColumns,
  DUMMY_ACTIONS,
  DUMMY_DATA,
  BarsData,
  
} from "./constants";
import DashboardLayout from "./components/DashboardLayout";
import Updates from "./components/Updates";
import DemandTrendChart from "./components/DemandTrendChart";
import ReservationChart from "./components/ReservationChart";
import GenericTable from "../../components/ui/GenericTable";
import BarsChart from "./components/BarsGraph";
const Dashboard = ({ Role }) => {
  Role = "admin";
  return (
    <DashboardLayout title={"Dashboard"}>
      <div className="grid grid-cols-12 xl:grid-cols-13 m-4 gap-4 *:rounded-lg">
        <title>Dashboard</title>
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
        <div className="flex items-center justify-center col-span-12 lg:col-span-8 xl:col-span-9 xl:row-span-2 min-h-52">
          <DemandTrendChart />
        </div>
        <div className="flex items-center justify-center row-start-4 col-span-12 xl:col-span-9 ">
          {Role === "admin" && (
            <GenericTable
              data={DUMMY_DATA}
              columns={TableColumns}
              actions={DUMMY_ACTIONS}
            />
          )}
          {Role==='tenant' &&
          (<BarsChart data={BarsData} />)}
          
        </div>
        <div className="flex items-center justify-center col-span-6 xl:col-span-4">
          <ReservationChart />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
