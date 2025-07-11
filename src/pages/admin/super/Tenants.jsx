import { useState, useEffect, useCallback } from "react";
import DropdownSelect from "../../../components/common/DropdownSelect";
import GenericTable from "../../../components/common/GenericTable";
import { superBookingHeadings } from "../../../constants/tableHeadings/superBookingHeadings";
import Button from '../../../components/common/buttons/MainButton'
import AddTenantForm from "../../../components/super/addTenant/AddTenantForm";
import UpgradeDowngradeForm from "../../../components/super/addTenant/UpgradeDowngradeForm";
import DeleteSuspendForm from "../../../components/super/addTenant/DeleteSuspendForm";
import ViewAccessEndPoint from "../../../components/super/addTenant/ViewAccessEndPoint";
import { useDispatch, useSelector } from "react-redux";
import { getPlans } from "../../../store/slices/plan/planSlice";
import { getAllTenants } from "../../../store/slices/super-admin/tenants/tenantSlice";
import Loader from "../../../components/common/Loader";

const Tenants = () => {
  const [subscription, setSubscription] = useState('');
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTenantData, setEditingTenantData] = useState(null);
  const [showUpgradeDowngradeForm, setShowUpgradeDowngradeForm] = useState(false);
  const [showDeleteSuspendForm, setShowDeleteSuspendForm] = useState(false);
  const [showViewAccessEndPoint, setShowViewAccessEndPoint] = useState(false);
  const [loading, setLoading] = useState({
    tenants: true,
    plans: true
  });
  const [error, setError] = useState(null);

  const [filteredData, setFilteredData] = useState([]);
  const [tenantsData, setTenantsData] = useState([]);

  const dispatch = useDispatch();
  const plans = useSelector(state => state.plan.plans);
  const allTenants = useSelector(state => state.tenants.allTenants);

  const filterData = () => {
    let updated = [...tenantsData];

    if (subscription) {
      updated = updated.filter((item) =>
        item.subscriptionType.toLowerCase() === subscription
      );
    }
    if (plan) {
      updated = updated.filter((item) =>
        item.plan.toLowerCase() === plan
      );
    }
    if (status) {
      updated = updated.filter((item) =>
        item.status.toLowerCase() === status
      );
    }

    setFilteredData(updated);
  };

  const handleDropdownChange = (option, row) => {
    if (option === "Edit Detail") {
      setEditingTenantData(row);
      setShowEditForm(true);
    } else if (option === "Upgrade / Downgrade") {
      setShowUpgradeDowngradeForm(true);
    } else if (option === "Suspend / Delete") {
      setShowDeleteSuspendForm(true);
      setEditingTenantData(row);
    } else if (option === "View Access Endpoint") {
      setShowViewAccessEndPoint(true);
    }
  };

  const fetchTenants = useCallback(async () => {
    setLoading(prev => ({ ...prev, tenants: true }));
    setError(null);

    try {
      const resultAction = await dispatch(getAllTenants()).unwrap();

      const filterTenantData = resultAction.tenants?.map(tenant => ({
        _id: tenant._id,
        tenantName: tenant.tenantName,
        plan: tenant.subscription?.plan?.planName || 'N/A',
        email: tenant.email,
        subscriptionType: tenant.subscription?.subscriptionType || 'N/A',
        startDate: tenant.subscription?.startDate
          ? new Date(tenant.subscription.startDate).toLocaleDateString()
          : 'N/A',
        nextBillingDate: tenant.subscription?.nextBillingDate
          ? new Date(tenant.subscription.nextBillingDate).toLocaleDateString()
          : 'N/A',
        status: tenant.status,
        location: 'Not Available',
        action: null,
      }));

      setTenantsData(filterTenantData);
      setFilteredData(filterTenantData);
    } catch (err) {
      console.error('Failed to fetch tenants:', err);
      setError('Failed to load tenants. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, tenants: false }));
    }
  }, [dispatch]);

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(prev => ({ ...prev, plans: true }));
      try {
        await dispatch(getPlans()).unwrap();
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(prev => ({ ...prev, plans: false }));
      }
    };

    fetchPlans();
    fetchTenants();
  }, [dispatch, fetchTenants]);

  // Reset filtered data when all filters are cleared
  useEffect(() => {
    if (!subscription && !plan && !status) {
      setFilteredData(tenantsData);
    }
  }, [subscription, plan, status, tenantsData]);

  const isLoading = loading.tenants || loading.plans;

  return (
    <div className="p-4  mx-auto bg-[#f7f7ff] min-h-screen">
      <h1 className="text-2xl font-semibold text-center mb-6">Tenant Management</h1>

      <div className="rounded-2xl shadow bg-white p-4 space-y-6">
        {/* Loading state for initial load */}
        {isLoading && !error ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">{error}</p>
            <Button
              onClick={fetchTenants}
              className="px-4 py-2"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            {/* Filters + Buttons */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-3 mb-10">
              {/* Filter Fields */}
              <div className="flex flex-col md:items-center md:flex-row gap-4 w-full md:w-2/3">
                <DropdownSelect
                  label="Subscription Type"
                  options={["Monthly", "Annual"].map((opt) => ({
                    id: opt,
                    label: opt,
                    value: opt.toLowerCase()
                  }))}
                  selected={subscription}
                  onChange={(opt) => setSubscription(opt.value)}
                />
                <DropdownSelect
                  label="Plan"
                  options={plans?.map((plan) => ({
                    id: plan._id,
                    label: plan.planName,
                    value: plan.planName?.toLowerCase()
                  }))}
                  selected={plan}
                  onChange={(opt) => setPlan(opt.value)}
                />
                <DropdownSelect
                  label="Status"
                  options={["Active", "Inactive"].map((status) => ({
                    id: status,
                    label: status,
                    value: status.toLowerCase()
                  }))}
                  selected={status}
                  onChange={(opt) => setStatus(opt.value)}
                />
                <Button
                  radius="rounded-xl"
                  className="px-5 py-1 shadow-none"
                  onClick={filterData}
                >
                  Filter
                </Button>
                {(plan || subscription || status) && (
                  <Button
                    radius="rounded-xl"
                    className="px-5 py-1 shadow-none bg-amber-300"
                    onClick={() => {
                      setPlan('');
                      setSubscription('');
                      setStatus('');
                    }}
                  >
                    Reset
                  </Button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex">
                <Button
                  radius="rounded-xl"
                  className="px-5 py-1 shadow-none"
                  onClick={() => setShowAddForm(true)}
                >
                  Add Tenant
                </Button>
              </div>
            </div>

            {/* Forms */}
            <AddTenantForm
              isOpen={showAddForm}
              onClose={() => setShowAddForm(false)}
              label={"Add Tenant"}
              fetchTenants={fetchTenants}
            />
            <AddTenantForm
              isOpen={showEditForm}
              onClose={() => setShowEditForm(false)}
              label={"Edit Tenant"}
              initialData={editingTenantData}
              fetchTenants={fetchTenants}
            />
            <UpgradeDowngradeForm
              isOpen={showUpgradeDowngradeForm}
              onClose={() => setShowUpgradeDowngradeForm(false)}
              label={"Upgrade / Downgrade Account"}
            />
            <DeleteSuspendForm
              isOpen={showDeleteSuspendForm}
              onClose={() => setShowDeleteSuspendForm(false)}
              label={"Delete / Suspend Account"}
              id={editingTenantData?._id}
              fetchTenants={fetchTenants}
            />
            <ViewAccessEndPoint
              isOpen={showViewAccessEndPoint}
              onClose={() => setShowViewAccessEndPoint(false)}
              label={"End Point Access"}
            />

            <GenericTable
              columns={superBookingHeadings}
              data={filteredData}
              actions={[
                "Upgrade / Downgrade",
                "Suspend / Delete",
                "View Access Endpoint"
              ]}
              handleDropdownChange={handleDropdownChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Tenants;