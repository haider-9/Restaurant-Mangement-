import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InfinityIcon, X } from 'lucide-react';
import Input from '../../common/Input';
import MainButton from '../../common/buttons/MainButton';
import DropdownSelect from '../../common/DropdownSelect';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../common/toast/useToast';
import { getLocations } from '../../../store/slices/tenant/locationSlice';
import { getTables, createBooking, editBooking } from '../../../store/slices/tenant/bookingSlice';
import { createReservation } from '../../../store/slices/location/reservationSlice';

const AddBookingForm = ({ isOpen, onClose, label, initialData, fetchBookings, isTenantAdmin = false }) => {
    const [formData, setFormData] = useState({
        customerName: '',
        email: '',
        phone: '',
        partySize: '',
        zipCode: '',
        source: '',
        tableId: '',
        date: '',
        time: '',
        allergies: '',
        specialRequests: '',
        note: ''
    });

    const [selectedLocation, setSelectedLocation] = useState({});
    const [selectedTableNumber, setSelectedTableNumber] = useState({});
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch();
    const { toast } = useToast();
    const userData = useSelector(state => state.auth.userData);
    const locations = useSelector(state => state.location.locations);
    const tables = useSelector(state => state.booking.tables);

    const userLocationId = !isTenantAdmin ? userData?.locationId : null;

    // Create a safe copy of available tables
    const availableTables = tables ? tables
        .filter(table => table.availability === true)
        .map(table => ({
            id: table._id,
            label: `Table ${table.tableNumber}`,
            value: table._id
        })) : [];

    const fetchLocations = useCallback(async () => {
        if (userData.tenantId) {
            await dispatch(getLocations(userData.tenantId));
        }
    }, [dispatch, userData.tenantId])

    useEffect(() => {
        if (isTenantAdmin) {
            fetchLocations();
        } else {
            // For non-tenant admins, set the location from userData
            if (userLocationId) {
                setSelectedLocation({
                    id: userLocationId,
                    label: userLocationId,
                    value: userLocationId
                });

            }
        }
    }, [dispatch, userData.tenantId, isTenantAdmin, fetchLocations, userLocationId]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('formData', formData)

        // Validate required fields
        const newErrors = {};
        if (!formData.customerName) newErrors.customerName = 'Full Name is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.partySize) newErrors.partySize = 'Party Size is required';
        if (!formData.time) newErrors.time = 'Time is required';
        if (!formData.zipCode) newErrors.zipCode = 'Zip Code is required';
        if (!formData.source) newErrors.source = 'Source is required';
        if (!selectedLocation) newErrors.location = 'Location is required';
        if (!selectedTableNumber.value) newErrors.table = 'Table is required';

        setLoading(true)

        try {

            let response;
            if (label === "Edit Booking") {
                console.log('formData', formData)
                // Edit booking flow
                response = await dispatch(editBooking({
                    id: initialData.bookingId,
                    payload: {
                        ...formData,
                        tableId: selectedTableNumber?.value
                    }
                }));
            } else {
                // Create booking flow (existing code)
                if (isTenantAdmin) {
                    response = await dispatch(createBooking(
                        {
                            locationId: selectedLocation.id,
                            tableId: selectedTableNumber.id,
                            body: {
                                ...formData,
                            }
                        }
                    ));
                } else {
                    response = await dispatch(createReservation(
                        {
                            locationId: selectedLocation?.id,
                            tableId: initialData?.table,
                            body: {
                                ...formData,
                            }
                        }
                    ));
                }
            }

            // Handle the response properly
            const payload = response?.payload;
            if (payload?.success) {
                toast({
                    title: payload.message ||
                        (label === "Edit Booking"
                            ? 'Booking updated successfully'
                            : 'Booking created successfully'),
                    variant: 'success'
                });
                onClose();
                resetForm();
                fetchBookings();
            } else {
                toast({
                    title: payload?.message ||
                        (label === "Edit Booking"
                            ? 'Failed to update booking'
                            : 'Failed to create booking'),
                    variant: 'destructive'
                });
            }
        } catch (error) {
            toast({
                title: label === "Edit Booking"
                    ? 'An error occurred while updating booking'
                    : 'An error occurred while creating reservation',
                variant: 'destructive'
            });
            console.error('Booking submission error:', error);
        } finally {
            setLoading(false)
        }
    };

    const handleTableDropdownClick = () => {
        if (!selectedLocation) {
            toast({ title: 'Please select location first', variant: 'destructive' });
            return false;
        }
        if (!formData.partySize) {
            toast({ title: 'Please select party size first', variant: 'destructive' });
            return false;
        }
        if (!formData.date) {
            toast({ title: 'Please select date first', variant: 'destructive' });
            return false;
        }
        if (!formData.time) {
            toast({ title: 'Please select time first', variant: 'destructive' });
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setFormData({
            customerName: '',
            email: '',
            phone: '',
            partySize: '',
            zipCode: '',
            source: '',
            date: '',
            time: '',
            allergies: '',
            specialRequest: '',
            note: ''
        });
        setSelectedLocation({});
        setSelectedTableNumber({});
        setErrors({});
    };

    // Create options
    const locationOptions = locations ? locations.map(location => ({
        id: location._id,
        label: location.locationName,
        value: location._id
    })) : [];

    const partySizeOptions = ["1", "2", "3", "4", "5", "6", "7", "8"].map(num => ({
        id: num,
        label: num,
        value: num
    }));

    const sourceOptions = ["Walk-in", "Reserved"].map(opt => ({
        id: opt.toLowerCase(),
        label: opt,
        value: opt.toLowerCase()
    }));

    console.log('initialData', initialData)
    console.log('location', userLocationId)
    console.log('locations', locations)

    useEffect(() => {
        if (initialData) {

            // console.log('initialData in useefe', initialData)
            setFormData({
                customerName: initialData.customerName || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                partySize: initialData.partySize || '',
                zipCode: initialData.zipCode || '',
                source: initialData.source || '',
                date: initialData.date?.slice(0, 10),
                time: initialData.time || '',
                allergies: initialData.allergies || '',
                specialRequest: initialData.specialRequests || '',
                note: initialData.note || ''
            });

            if (locations && locations.length > 0) {
                const matchingLocation = locations.find((loc) => loc._id === initialData.locationId);
                if (matchingLocation) {
                    setSelectedLocation({
                        id: matchingLocation._id,
                        label: matchingLocation.locationName,
                        value: matchingLocation._id
                    });
                }
            }

            setSelectedTableNumber({
                id: initialData.tableId,
                label: initialData.table,
                value: initialData.tableId
            });

        }
    }, [initialData, locations])

    useEffect(() => {
        const locationId = isTenantAdmin ? selectedLocation?.id : userLocationId;

        const fetchTables = async () => {
            console.log('Tables req:', (locationId));
            if (locationId && formData.partySize && formData.date && formData.time) {
                try {

                    const response = await dispatch(getTables({
                        locationId: locationId,
                        body: {
                            partySize: formData.partySize,
                            date: formData.date,
                            time: formData.time
                        }
                    }));
                } catch (error) {
                    console.error('Error fetching tables:', error);
                }
            }
        };

        fetchTables();
    }, [selectedLocation, formData.partySize, formData.date, formData.time, dispatch, isTenantAdmin, userLocationId]);

    if (!isOpen) return null;

    return (
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
                    <h2 className="text-xl font-semibold text-textPrimary">{label}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                }} onClick={(e) => {
                    if (e.target.type !== 'submit') {
                        e.preventDefault();
                    }
                }} className="space-y-3">
                    {/* Full Name */}
                    <div className='flex w-full items-center'>
                        <label className="w-2/8 text-left text-sm text-textSecondary font-medium mb-1">Name</label>
                        <Input
                            className="w-6/8 py-1.5 text-xs"
                            placeholder="Enter customer full name"
                            name="customerName"
                            disabled={label === "Edit Booking"}
                            value={formData.customerName}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='flex w-full items-center'>
                        <label className="w-2/8 text-left text-sm text-textSecondary font-medium mb-1">Phone</label>
                        <Input
                            className="w-6/8 py-1.5 text-xs"
                            placeholder="Enter your phone number"
                            name="phone"
                            disabled={label === "Edit Booking"}
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Email */}
                    <div className='flex w-full items-center'>
                        <label className="w-2/8 text-left text-sm text-textSecondary font-medium mb-1">Email</label>
                        <Input
                            className="w-6/8 py-1.5 text-xs"
                            placeholder="Enter your email"
                            name="email"
                            disabled={label === "Edit Booking"}
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className='flex'>
                        {/* Location */}

                        {isTenantAdmin ? (
                            <div className='flex w-1/2 items-center'>
                                <label className="w-2/6 text-left text-sm text-textSecondary font-medium mb-1">Location</label>
                                <DropdownSelect
                                    label="Select"
                                    options={locationOptions}

                                    selected={selectedLocation?.label}
                                    onChange={(opt) => {
                                        setSelectedLocation(opt);
                                        setErrors(prev => ({ ...prev, location: undefined }));
                                    }}
                                />
                            </div>
                        ) : (
                            <input type="hidden" name="locationId" value={userLocationId} />
                        )}

                        {/* Party Size */}
                        <div className='flex w-1/2 items-center'>
                            <label className="w-2/6 text-left text-sm text-textSecondary font-medium mb-1">Party Size</label>
                            <DropdownSelect
                                label="Select Size"
                                options={partySizeOptions}
                                selected={formData.partySize}
                                onChange={(opt) => {
                                    setFormData(prev => ({ ...prev, partySize: opt.value }));
                                    setErrors(prev => ({ ...prev, partySize: undefined }));
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-full gap-2">
                        <div className="flex items-center justify-center w-1/2">
                            <label className="w-2/6 text-left text-sm text-textSecondary font-medium mb-1">Date</label>
                            <Input
                                type="date"
                                className="w-4/6 rounded-xl text-xs border border-gray-400 px-1 py-2"
                                name="date"
                                value={formData.date}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="flex items-center justify-center w-1/2">
                            <label className="w-2/6 text-left text-sm text-textSecondary font-medium mb-1">Time</label>
                            <Input
                                type="time"
                                className="w-4/6 text-xs border border-gray-400 px-1 py-2 rounded-xl"
                                name="time"
                                value={formData.time}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-full gap-2">
                        {/* Table */}
                        <div className='flex w-1/2 items-center'>
                            <label className="w-2/6 text-left text-sm text-textSecondary font-medium mb-1">Table</label>
                            <DropdownSelect
                                label="Select Table"
                                options={availableTables}
                                selected={selectedTableNumber?.label}
                                onChange={(opt, e) => {
                                    e?.stopPropagation();
                                    setSelectedTableNumber(opt);
                                    setErrors(prev => ({ ...prev, table: undefined }));
                                }}
                                onToggle={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!selectedLocation || !formData.partySize || !formData.date || !formData.time) {
                                        handleTableDropdownClick();
                                    }
                                }}
                                disabled={!selectedLocation || !formData.partySize || !formData.date || !formData.time}
                            />

                        </div>

                        {/* Zip Code */}
                        <div className='flex w-1/2 items-center'>
                            <label className="w-3/8 text-left text-sm text-textSecondary font-medium mb-1">Zip Code</label>
                            <Input
                                className="w-5/8 py-1"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className='flex w-1/2 items-center'>
                        <label className="w-2/6 text-left text-sm text-textSecondary font-medium">Source</label>
                        <DropdownSelect
                            label="Select Source"
                            options={sourceOptions}
                            selected={formData.source}
                            onChange={(opt, e) => {
                                e?.stopPropagation();
                                setFormData(prev => ({ ...prev, source: opt.value }));
                                setErrors(prev => ({ ...prev, source: undefined }));
                            }}
                            onToggle={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!selectedLocation || !formData.partySize || !formData.date || !formData.time) {
                                    handleTableDropdownClick();
                                }
                            }}
                        />
                    </div>

                    <div className='space-y-3'>
                        <Input
                            type='textarea'
                            placeholder="Any Allergy"
                            className="text-xs"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleInputChange}
                        />
                        <Input
                            type='textarea'
                            placeholder="Any Special Request"
                            className="text-xs"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleInputChange}
                        />
                        <Input
                            type='textarea'
                            placeholder="Any Note"
                            className="text-xs"
                            name="note"
                            value={formData.note}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <MainButton
                            type="button"
                            onClick={() => {
                                onClose();
                                resetForm();
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

export default AddBookingForm;