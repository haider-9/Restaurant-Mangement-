import Layout from '@/components/common/Layout';
import DemandTrendChart from '@/components/location/dashboard/DemandTrendChart';
import LocationAdminMetrics from '@/components/location/dashboard/LocationAdminMetrics';
import ReservationChart from '@/components/location/dashboard/ReservationChart';
import ReservationsTable from '@/components/location/dashboard/ReservationsTable';
import Updates from '@/components/location/dashboard/Updates';

function Dashboard() {
  return (
    <Layout title={"Dashboard"}>
      <div className="grid grid-cols-12 xl:grid-cols-13 m-4 gap-4 *:rounded-3xl">
        <title>Dashboard - Location Admin</title>

        <div className="col-span-12 lg:col-span-4 xl:col-span-9 grid grid-cols-subgrid gap-2">
          <LocationAdminMetrics />
        </div>
        <div className="row-start-3 lg:row-start-2 xl:row-start-1 col-span-12 sm:col-span-6 xl:col-span-4 xl:col-start-10 xl:row-span-3 bg-white border">
          <Updates />
        </div>
        <div className="flex items-center justify-center col-span-12 lg:col-span-8 xl:col-span-9 xl:row-span-2 min-h-52 bg-white border">
          <DemandTrendChart />
        </div>
        <div className="flex items-center justify-center row-start-4 col-span-12 xl:col-span-9 bg-white p-4 border">
          <ReservationsTable />
        </div>
        <div className="flex items-center justify-center col-span-12 sm:col-span-6 xl:col-span-4 bg-white border">
          <ReservationChart />
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard