/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../../config/api";
import simpleApi from "../../../config/simpleApi";
import locationApi from "../../../config/locationApi";
import tenantApi from "../../../config/tenantApi";
import reservationApi from "../../../config/reservationApi";
import asyncHandler from "../../../utils/asyncHandler";


const initialState = {
    allBookings: [],
    tables: [],
    loading: false,
    error: null,
};


export const getAllbookings = createAsyncThunk(
    "booking/getAllbookings",
    async (params, { rejectWithValue }) => {
        const { tenantId, clientType, dateRange, source, locationId } = params;

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (clientType) queryParams.append('clientType', clientType);
        if (dateRange) queryParams.append('dateRange', dateRange[0]);
        if (dateRange) queryParams.append('dateRange', dateRange[1]);
        if (source) queryParams.append('source', source);
        if (locationId) queryParams.append('locationId', locationId);

        const { data, error } = await asyncHandler(() =>
            tenantApi.get(`/${tenantId}/reservations?${queryParams.toString()}`)
        );

        // console.log('data.reservations', data.reservations)

        if (error) return rejectWithValue(error);
        return data;
    }
);

export const getTables = createAsyncThunk(
    "booking/getTables",
    async ({ locationId, body }, { rejectWithValue }) => {
        const { data, error } = await asyncHandler(() =>
            locationApi.post(`/${locationId}/tables/freeTimes`, body)
        );

        if (error) return rejectWithValue(error);
        return data;
    }
);

export const createBooking = createAsyncThunk(
    "booking/createBooking",
    async ({ locationId, tableId, body }, { rejectWithValue }) => {
        console.log('payload', body)
        const { data, error } = await asyncHandler(() =>
            reservationApi.post(`/locations/${locationId}/tables/${tableId}`, body)
        );
        console.log('data, error', data, error)
        if (error) return rejectWithValue(error);
        return data;
    }
);

export const editBooking = createAsyncThunk(
    "tenants/editTenant",
    async ({id, payload}, { rejectWithValue }) => {
        const { data, error } = await asyncHandler(() =>
            reservationApi.put(`/${id}`, "", payload) 
        );

        if (error) return rejectWithValue(error);
        return data;
    }
);

export const upgradeDowngradTenant = createAsyncThunk(
    "tenants/upgradeDowngradTenant",
    async (_, { rejectWithValue }) => {
        const { data, error } = await asyncHandler(() =>
            tenantApi.put('/tenant', data) //TODO: change route
        );

        if (error) return rejectWithValue(error);
        return data;
    }
);

export const getTenant = createAsyncThunk(
    "tenants/getTenant",
    async (id, { rejectWithValue }) => {
        const { data, error } = await asyncHandler(() =>
            tenantApi.get('/tenants', id)
        );

        if (error) return rejectWithValue(error);
        return data;
    }
);

export const deleteTenant = createAsyncThunk(
    "tenants/deleteTenant",
    async (id, { rejectWithValue }) => {
        const { data, error } = await asyncHandler(() =>
            tenantApi.delete('/tenants', id)
        );

        if (error) return rejectWithValue(error);
        return data;
    }
);

export const suspendTenant = createAsyncThunk(
    "tenants/suspendTenant",
    async (id, { rejectWithValue }) => {
        const { data, error } = await asyncHandler(() =>
            tenantApi.delete('/tenants', id)
        );

        if (error) return rejectWithValue(error);
        return data;
    }
);


const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setAllBookings: (state, action) => {
            state.allBookings = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            //get all bookings
            .addCase(getAllbookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllbookings.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.allBookings = action.payload.reservations?.map((r) => ({
                    bookingId: r._id,
                    customerName: r.customer?.customerName,
                    locationId: r.locationId,
                    customerType: r.customer?.customerType || "New",
                    date: new Date(r.date).toLocaleDateString(),
                    time: r.time,
                    table: r.tableId,
                    source: r.source,
                    email: r.customer?.customerEmail,
                    phone: r.customer?.customerPhone,
                    zipCode: r.customer?.customerZipCode,
                    allergies: r.allergies,
                    partySize: r.partySize,
                    specialRequests: r.specialRequests,
                    status: r.status,
                    tableId: r.tableId,
                    tenantId: r.tenantId
                }));

            })
            .addCase(getAllbookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.payload || "Fetching reservation failed";
            })
            //create booking
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                // state.tenants = action.payload.tenants;

            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message ||  "Creating reservation failed" ;
            })

            //get tables
            .addCase(getTables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTables.fulfilled, (state, action) => {
                state.loading = false;
                state.status = true;
                state.tables = action.payload.tables;

            })
            .addCase(getTables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message ||  "Fetching Tables failed" ;
            })

    },
});

export const { setAllBookings } = bookingSlice.actions;

export default bookingSlice.reducer;
