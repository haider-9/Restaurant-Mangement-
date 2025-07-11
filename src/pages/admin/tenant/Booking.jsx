import { useState, useEffect, useCallback } from "react";
import DropdownSelect from "../../../components/common/DropdownSelect";
import GenericTable from "../../../components/common/GenericTable";
import { tenantBookingHeadings } from "../../../constants/tableHeadings/tenantBookingHeadings";
import Button from '../../../components/common/buttons/MainButton';
import AddBookingForm from "../../../components/tenant/booking/AddBookingForm";
import ConfirmationModal from '../../../components/common/ConfirmationModal';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from "react-redux";
import { getAllbookings } from "../../../store/slices/tenant/bookingSlice";
import Loader from "../../../components/common/Loader";
import { getLocations } from "../../../store/slices/tenant/locationSlice";

const Booking = () => {
    const dispatch = useDispatch();
    const { allBookings, loading, error } = useSelector((state) => state.booking);
    const userData = useSelector(state => state.auth.userData);
    const tenantId = userData?.tenantId

    const [clientType, setClientType] = useState("");
    const [dateRange, setDateRange] = useState([null, null]);
    const [source, setSource] = useState("");
    const [table, setTable] = useState("");
    const [location, setLocation] = useState(null);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingRowData, setEditingRowData] = useState(null);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [noShowForm, setNoShowForm] = useState(false);
    const [showMarkAsCompleted, setShowMarkAsCompleted] = useState(false);
    const [allLocations, setAllLocations] = useState([])

    const fetchBookings = useCallback(async (filters = {}) => {
        if (!userData?.tenantId) return;
        
        setLocalLoading(true);
        setLocalError(null);
        
        try {
            const params = {
                tenantId: userData?.tenantId,
                ...filters
            };
            await dispatch(getAllbookings(params));
        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setLocalError(err.message || 'Failed to load bookings. Please try again.');
        } finally {
            setLocalLoading(false);
        }
    }, [dispatch, userData]);

    const handleFilter = useCallback(() => {
        const filters = {};
        
        if (clientType) filters.clientType = clientType;
        if (dateRange && dateRange[0] && dateRange[1]) {
            filters.dateRange = [new Date(dateRange[0]).toISOString(), new Date(dateRange[1]).toISOString()]
        }
        if (source) filters.source = source;
        if (table) filters.tableId = table;
        if (location) filters.locationId = location.id;

        fetchBookings(filters);
    }, [clientType, dateRange, source, table, location, fetchBookings]);

    const handleResetFilters = useCallback(() => {
        setClientType("");
        setDateRange([null, null]);
        setSource("");
        setTable("");
        setLocation("");
        fetchBookings();
    }, [fetchBookings]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleDropdownChange = (option, row) => {
        if (option === "Edit Booking") {
            setEditingRowData(row);
            setShowEditForm(true);
        } else if (option === "Cancel Booking") {
            setShowCancelForm(true);
        } else if (option === "No Show") {
            setNoShowForm(true);
        } else if (option === "Mark as Completed") {
            setShowMarkAsCompleted(true);
        }
    };

    const getAllLocations = useCallback(async () => {
            const response = await dispatch(getLocations(tenantId))
            console.log('response', response)
            if(response.payload?.success) {
                setAllLocations(response.payload?.locations)
            }
        }, [dispatch, tenantId])
    useEffect(() => {
        getAllLocations()
    }, [getAllLocations])

    const isLoading = localLoading;
    const hasError = error || localError;
    const hasFilters = clientType || (dateRange[0] && dateRange[1]) || source || table || location;


    console.log('allBookings', allBookings)

    return (
        <div className="p-4 mx-auto bg-[#f7f7ff]">
            <h1 className="text-2xl font-semibold text-center mb-6">Reservation</h1>

            <div className="rounded-2xl shadow bg-white p-4">
                {isLoading && !hasError ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader size="lg" />
                    </div>
                ) : hasError ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <p className="text-red-500 mb-4">{hasError}</p>
                        <Button 
                            onClick={() => fetchBookings()}
                            className="px-4 py-2"
                        >
                            Retry
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-col justify-between my-4">
                            <div className="flex gap-4 text-sm">
                                <Button
                                    radius="rounded-xl"
                                    className="px-2 py-1 shadow-none text-sm"
                                    onClick={() => setShowAddForm(true)}
                                >
                                    Add Booking +
                                </Button>
                            </div>
                        </div>
                        
                        <div className="flex flex-col md:items-center lg:flex-row gap-4 w-full md:w-5/6 text-sm">
                            <DropdownSelect
                                label="Client Type"
                                options={["New", "Returning", "VIP"].map((type) => ({
                                    id: type.toLowerCase(),
                                    label: type,
                                    value: type.toLowerCase()
                                }))}
                                selected={clientType}
                                onChange={(opt) => setClientType(opt.value)}
                            />
                            
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-textPrimary mb-1">Date Range</label>
                                <DateRangePicker
                                    onChange={setDateRange}
                                    value={dateRange}
                                    className="react-daterange-picker-custom rounded-2xl"
                                />
                            </div>
                            
                            <DropdownSelect
                                label="Source"
                                options={["Walk-in", "Reserved"].map((type) => ({
                                    id: type.toLowerCase(),
                                    label: type,
                                    value: type.toLowerCase()
                                }))}
                                selected={source}
                                onChange={(opt) => setSource(opt.value)}
                            />
                            
                            <DropdownSelect
                                label="Location"
                                options={allLocations?.map((loc) => ({
                                    id: loc._id,
                                    label: loc.locationName,
                                    value: loc._id
                                }))}
                                selected={location?.label}
                                onChange={(opt) => setLocation(opt)}
                            />
                            
                            <Button
                                radius="rounded-xl"
                                className="px-5 py-1 shadow-none"
                                onClick={handleFilter}
                            >
                                Filter
                            </Button>
                            
                            {hasFilters && (
                                <Button
                                    radius="rounded-xl"
                                    className="px-5 py-1 shadow-none bg-amber-300"
                                    onClick={handleResetFilters}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>

                        <AddBookingForm 
                            isOpen={showAddForm} 
                            onClose={() => setShowAddForm(false)} 
                            label="Add Booking"
                            fetchBookings={() => fetchBookings()}
                            isTenantAdmin={true}
                        />
                        
                        <AddBookingForm 
                            isOpen={showEditForm} 
                            onClose={() => setShowEditForm(false)} 
                            label="Edit Booking"
                            initialData={editingRowData}
                            fetchBookings={() => fetchBookings()}
                            isTenantAdmin={true}
                        />
                        
                        <ConfirmationModal 
                            isOpen={showCancelForm} 
                            onClose={() => setShowCancelForm(false)} 
                            label="Cancel Booking" 
                            message="Are you sure to cancel the reservation!" 
                        />
                        
                        <ConfirmationModal 
                            isOpen={showMarkAsCompleted} 
                            onClose={() => setShowMarkAsCompleted(false)} 
                            label="Mark as Completed" 
                            message="Are you sure to Mark the reservation as Completed!" 
                        />

                        <div className="flex justify-start pt-4">
                            <label className="text-lg font-semibold">All Bookings</label>
                        </div>
                        
                        <GenericTable
                            columns={tenantBookingHeadings}
                            data={allBookings || []}
                            actions={["Edit Booking", "Cancel Booking", "No Show", "Mark as Completed"]}
                            handleDropdownChange={handleDropdownChange}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Booking;