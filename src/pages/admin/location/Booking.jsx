import { useState, useEffect, useCallback } from "react";
import DropdownSelect from "../../../components/common/DropdownSelect";
import GenericTable from "../../../components/common/GenericTable";
import { locationBookingHeadings } from "../../../constants/tableHeadings/locationBookingHeadings";
import Button from '../../../components/common/buttons/MainButton'
import AddBookingForm from "../../../components/tenant/booking/AddBookingForm";
import ConfirmationModal from '../../../components/common/ConfirmationModal'
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
import { useDispatch, useSelector } from "react-redux";
import { editReservation, getAllReservations, getAllStaffReservations } from "../../../store/slices/location/reservationSlice";
import Loader from "../../../components/common/Loader";
import locationApi from "../../../config/locationApi";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import Input from "../../../components/common/Input"
import MainButton from "../../../components/common/buttons/MainButton";
import Api from "../../../config/api";
import { useToast } from "@/components/common/toast/useToast";

const Booking = () => {
    const dispatch = useDispatch();
    const { allReservations, loading, error } = useSelector((state) => state.reservation);
    const userData = useSelector(state => state.auth.userData);
    const isLocationAdmin = userData?.role === "location-admin";
    const staffId = !isLocationAdmin ? userData?._id : null;
    const locationId = userData?.locationId;
    const tenantId = userData?.tenantId;

    const [clientType, setClientType] = useState({});
    const [dateRange, setDateRange] = useState([null, null]);
    const [source, setSource] = useState({});
    const [tableId, setTableId] = useState("");
    const [partySize, setPartySize] = useState("");
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState(null);
    const [allTables, setAllTables] = useState([]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingRowData, setEditingRowData] = useState(null);
    const [showCancelForm, setShowCancelForm] = useState(false);
    const [noShowForm, setNoShowForm] = useState(false);
    const [showMarkAsCompleted, setShowMarkAsCompleted] = useState(false);
    const [showAddTableForm, setShowAddTableForm] = useState(false);
    const [allBookingLocal, setAllBookingLocal] = useState([]);


    const { toast } = useToast()

    const fetchBookings = useCallback(async (filters = {}) => {
        if (!userData?.locationId) return;

        setLocalLoading(true);
        setLocalError(null);

        try {
            const params = {
                ...filters,
                locationId
            };

            let response;
            if (isLocationAdmin) {
                response = await dispatch(getAllReservations(params));
            } else {
                response = await dispatch(getAllReservations(params));
                // await dispatch(getAllStaffReservations({ 
                //     ...params,
                //     staffId 
                // }));
            }
            console.log('response', response)
            if (response.success) {
                setAllBookingLocal(response.reservations)
            }

        } catch (err) {
            console.error('Failed to fetch bookings:', err);
            setLocalError('Failed to load bookings. Please try again.');
        } finally {
            setLocalLoading(false);
        }
    }, [dispatch, userData, isLocationAdmin, staffId, locationId]);

    const handleFilter = useCallback(() => {
        const filters = {};

        if (clientType) filters.clientType = clientType.value;
        if (dateRange && dateRange[0] && dateRange[1]) {
            filters.dateRange = [new Date(dateRange[0]).toISOString(), new Date(dateRange[1]).toISOString()]
        }
        if (source) filters.source = source.value;
        if (tableId) filters.tableId = tableId;
        if (partySize) filters.partySize = partySize;

        fetchBookings(filters);
    }, [clientType, dateRange, source, tableId, partySize, fetchBookings]);

    const handleResetFilters = useCallback(() => {
        setClientType({});
        setDateRange([null, null]);
        setSource({});
        setTableId("");
        setPartySize("");
        fetchBookings(); // Fetch without filters
    }, [fetchBookings]);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleDropdownChange = async (option, row) => {
    if (option === "Edit Booking") {
        setEditingRowData(row);
        setShowEditForm(true);
    } else {
        try {
            let status;
            if (option === "Cancel Booking") status = 'cancelled';
            else if (option === "No Show") status = 'no-show';
            else if (option === "Mark as Completed") status = 'completed';
            
            await handleStatusUpdate(row.bookingId, status);
        } catch (error) {
            console.error(`Failed to ${option.toLowerCase()}:`, error);
        }
    }
};

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            setLocalLoading(true);
            const response = await dispatch(editReservation({
                bookingId,
                selectedStatus: status
            }));

            if (response.payload?.success) {
                toast({
                    title: getSuccessMessage(status),
                    variant: 'success'
                });
                fetchBookings(); // Refresh the bookings list
            } else {
                toast({
                    title: response.payload?.message || 'Failed to update booking status',
                    variant: 'destructive'
                });
            }
        } catch (error) {
            toast({
                title: 'An error occurred while updating booking status',
                variant: 'destructive'
            });
            console.error('Status update error:', error);
        } finally {
            setLocalLoading(false);
        }
    };

    // Helper function to get appropriate success message
    const getSuccessMessage = (status) => {
        const messages = {
            'completed': 'Booking marked as completed successfully',
            'cancelled': 'Booking cancelled successfully',
            'no-show': 'Booking marked as no show successfully'
        };
        return messages[status] || 'Booking status updated successfully';
    };

    useEffect(() => {
        const fetchAllTables = async () => {
            try {
                const response = await locationApi.get(`/${locationId}/tables`);
                if (response) {
                    setAllTables(response.tables);
                }
            } catch (err) {
                console.error('Failed to fetch tables:', err);
            }
        }

        if (locationId) {
            fetchAllTables();
        }
    }, [locationId]);

    const isLoading = loading || localLoading;
    const hasError = error || localError;
    const hasFilters = clientType.value || (dateRange[0] && dateRange[1]) || source || tableId || partySize;


    return (
        <div className="p-4  mx-auto bg-[#f7f7ff]">
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
                        <div className="flex gap-4">
                            <div className="flex flex-col  justify-between my-4">
                                <div className="flex gap-3 text-sm">
                                    <Button
                                        radius="rounded-3xl"
                                        className="px-3 py-2  text-sm"
                                        onClick={() => setShowAddForm(true)}
                                    >
                                        Add Booking +
                                    </Button>
                                </div>
                            </div>
                            {/* //TODO: remove after testing */}
                            <div className="flex flex-col justify-between my-4">
                                <div className="flex gap-3 text-sm">
                                    <Button
                                        radius="rounded-3xl"
                                        className="px-3 py-2 text-sm"
                                        onClick={() => setShowAddTableForm(true)}
                                    >
                                        Add Table +
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:items-center lg:flex-row gap-4 w-full md:w-7/8 text-sm">
                            <DropdownSelect
                                label="Client Type"
                                options={["New", "Returning", "VIP"].map((type) => ({
                                    id: type.toLowerCase(),
                                    label: type,
                                    value: type.toLowerCase()
                                }))}
                                selected={clientType.label}
                                onChange={(opt) => setClientType(opt)}
                            />

                            <DropdownSelect
                                label="Source"
                                options={["Walk-in", "Reserved"].map((type) => ({
                                    id: type.toLowerCase(),
                                    label: type,
                                    value: type.toLowerCase()
                                }))}
                                selected={source.label}
                                onChange={(opt) => setSource(opt)}
                            />

                            <DropdownSelect
                                label="Table"
                                options={allTables?.map((table) => ({
                                    id: table._id,
                                    label: table.tableNumber,
                                    value: table._id
                                }))}
                                selected={tableId}
                                onChange={(opt) => setTableId(opt.value)}
                            />

                            <DropdownSelect
                                label="Party"
                                options={["1", "2", "3", "4", "5", "6", "7", "8"].map((size) => ({
                                    id: size,
                                    label: size,
                                    value: size
                                }))}
                                selected={partySize}
                                onChange={(opt) => setPartySize(opt.value)}
                            />

                            
                            <div className="flex items-center gap-2 w-full">
                                <label className="text-sm text-textPrimary mb-1">Date Range</label>
                                <DateRangePicker
                                    onChange={setDateRange}
                                    value={dateRange}
                                    className="react-daterange-picker-custom rounded-2xl w-full"
                                    clearIcon={null}
                                />
                            </div>

                            <Button
                                radius="rounded-xl"
                                className="px-5 py-1 w-full shadow-none"
                                onClick={handleFilter}
                            >
                                Filter
                            </Button>

                            {hasFilters && (
                                <Button
                                    radius="rounded-xl"
                                    className="px-5 w-full py-1 shadow-none bg-amber-300"
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
                            isTenantAdmin={false}
                        />

                        <AddBookingForm
                            isOpen={showEditForm}
                            onClose={() => setShowEditForm(false)}
                            label="Edit Booking"
                            initialData={editingRowData}
                            fetchBookings={() => fetchBookings()}
                            isTenantAdmin={false}
                        />


                        <ConfirmationModal
                            isOpen={showCancelForm}
                            onClose={() => setShowCancelForm(false)}
                            onConfirm={() => handleStatusUpdate(editingRowData?.bookingId, 'cancelled')}
                            label="Cancel Booking"
                            message="Are you sure to cancel the reservation?"
                        />

                        <ConfirmationModal
                            isOpen={noShowForm}
                            onClose={() => setNoShowForm(false)}
                            onConfirm={() => handleStatusUpdate(editingRowData?.bookingId, 'no-show')}
                            label="Mark as No Show"
                            message="Are you sure to mark this reservation as No Show?"
                        />

                        <ConfirmationModal
                            isOpen={showMarkAsCompleted}
                            onClose={() => setShowMarkAsCompleted(false)}
                            onConfirm={() => handleStatusUpdate(editingRowData?.bookingId, 'completed')}
                            label="Mark as Completed"
                            message="Are you sure to mark this reservation as Completed?"
                        />

                        <AddTableForm
                            isOpen={showAddTableForm}
                            onClose={() => setShowAddTableForm(false)}
                            tenantId={tenantId}
                            locationId={locationId}
                        // toast={toast}
                        />

                        <div className="flex justify-start pt-4">
                            <label className="text-lg font-semibold">All Customers</label>
                        </div>

                        <GenericTable
                            columns={locationBookingHeadings}
                            data={allReservations || []}
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

// TODO: Remove after testing
const AddTableForm = ({
    isOpen,
    onClose,
    tenantId,
    locationId
}) => {
    const [formData, setFormData] = useState({
        tableNumber: '',
        seats: '',
        section: '',
        status: 'available'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { toast } = useToast()

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const tableApi = new Api('/api/table/create-table/tenant')
            const response = await tableApi.post(`/${tenantId}/location/${locationId}`, formData);
            if (response.success) {
                toast({ title: 'Table created successfully', variant: 'success' });
                onClose();
                // You might want to refresh tables here
            } else {
                setError(response.message || 'Failed to add table');
            }
        } catch (err) {
            console.error('Add table error:', err);
            setError('Failed to add table. Please try again.');
            toast({ title: err.message || 'Failed to add table. Please try again.', variant: 'destructive' });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        // <div className="fixed inset-0 z-50 overflow-y-auto">
        //   {/* Background overlay - click to close */}
        //   <div 
        //     className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        //     onClick={onClose}
        //   ></div>

        //   {/* Modal container - stops click propagation */}
        //   <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        //     {/* This element is to trick the browser into centering the modal contents */}
        //     <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        //     {/* Actual modal content */}
        //     <div 
        //       className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        //       onClick={(e) => e.stopPropagation()} // Prevent clicks from closing modal
        //     >
        //       <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        //         <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
        //           Add New Table
        //         </h3>

        //         {error && (
        //           <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
        //             {error}
        //           </div>
        //         )}

        //         <form onSubmit={handleSubmit}>
        //           <div className="space-y-4">
        //             <div>
        //               <label className="block text-sm font-medium text-gray-700">
        //                 Table Number
        //               </label>
        //               <input
        //                 type="text"
        //                 name="tableNumber"
        //                 value={formData.tableNumber}
        //                 onChange={handleInputChange}
        //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        //                 required
        //               />
        //             </div>

        //             <div>
        //               <label className="block text-sm font-medium text-gray-700">
        //                 Number of Seats
        //               </label>
        //               <input
        //                 type="number"
        //                 name="seats"
        //                 min="1"
        //                 value={formData.seats}
        //                 onChange={handleInputChange}
        //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        //                 required
        //               />
        //             </div>

        //             <div>
        //               <label className="block text-sm font-medium text-gray-700">
        //                 Section
        //               </label>
        //               <input
        //                 type="text"
        //                 name="section"
        //                 value={formData.section}
        //                 onChange={handleInputChange}
        //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        //                 required
        //               />
        //             </div>

        //             <div>
        //               <label className="block text-sm font-medium text-gray-700">
        //                 Status
        //               </label>
        //               <select
        //                 name="status"
        //                 value={formData.status}
        //                 onChange={handleInputChange}
        //                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        //               >
        //                 <option value="available">Available</option>
        //                 <option value="reserved">Reserved</option>
        //                 <option value="occupied">Occupied</option>
        //                 <option value="out_of_service">Out of Service</option>
        //               </select>
        //             </div>
        //           </div>

        //           <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        //             <button
        //               type="submit"
        //               disabled={loading}
        //               className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm ${
        //                 loading ? 'opacity-50 cursor-not-allowed' : ''
        //               }`}
        //             >
        //               {loading ? 'Adding...' : 'Add Table'}
        //             </button>
        //             <button
        //               type="button"
        //               onClick={onClose}
        //               className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
        //             >
        //               Cancel
        //             </button>
        //           </div>
        //         </form>
        //       </div>
        //     </div>
        //   </div>
        // </div>
        <div className='fixed inset-0 z-50 flex items-center justify-center'>
            <motion.div
                className="absolute inset-0 bg-black"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
            />

            <motion.div
                initial={{ x: "70%" }}
                animate={{ x: 0, opacity: 100 }}
                exit={{ x: "70%", opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-50 h-auto w-full max-w-md bg-white rounded-4xl shadow-lg p-6 overflow-y-auto"
            >
                <div className="mb-5 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-textPrimary">Add Table</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Full Name */}
                    <div className='flex w-full items-center'>
                        <label className="w-2/8 text-left text-sm text-textSecondary font-medium mb-1">Table Numer</label>
                        <Input
                            className="w-6/8 py-1.5 text-xs"
                            placeholder="Enter table number"
                            name="tableNumber"
                            value={formData.tableNumber}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='flex w-full items-center'>
                        <label className="w-2/8 text-left text-sm text-textSecondary font-medium mb-1">Seats</label>
                        <Input
                            className="w-6/8 py-1.5 text-xs"
                            placeholder="Enter seat number"
                            name="seats"
                            value={formData.seats}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Email */}
                    <div className='flex w-full items-center'>
                        <label className="w-2/8 text-left text-sm text-textSecondary font-medium mb-1">Section</label>

                        <select className="border p-1 w-full rounded-lg" name="section" value={formData.section} id="" onChange={handleInputChange}>
                            <option value="">Select</option>
                            <option value="bar area">Bar Area</option>
                            <option value="patio">Patio</option>
                            <option value="private room">Private Room</option>
                            <option value="main dining">Main Dining</option>
                        </select>
                    </div>
                    <div className='flex w-full items-center'>
                        <label className="w-2/8 text-left text-sm text-textSecondary font-medium mb-1">Status</label>

                        <select className="border p-1 w-full rounded-lg" disabled name="status" value={formData.status} id="" onChange={handleInputChange}>
                            <option value="available">Available</option>
                            <option value="out-of-service">Out of Service</option>
                            <option value="reserved">Reserved</option>
                            <option value="ocuppied">Ocuppied</option>
                        </select>
                    </div>


                    <div className="pt-4 flex justify-end gap-3">
                        <MainButton
                            type="button"
                            onClick={() => {
                                onClose();
                            }}
                            className="bg-gray-600 px-3"
                            radius='rounded-xl'
                        >
                            Cancel
                        </MainButton>
                        <MainButton
                            type="submit"
                            className="px-3"
                            radius='rounded-xl'
                            onClick={() => {
                                // if (errors) {
                                //     toast({ title: 'Please fill all required fields', variant: 'destructive' });
                                // }
                            }}
                        >
                            {loading ? <div className="flex items-center gap-2">
                                <span className="loader w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                                Loading...
                            </div> : 'Save'}
                        </MainButton>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};