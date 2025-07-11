/* eslint-disable no-unused-vars */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../../config/api";
import locationApi from "../../../config/locationApi";
import asyncHandler from "../../../utils/asyncHandler";
import reservationApi from "../../../config/reservationApi";


const initialState = {
  allReservations: [],
  loading: false,
  error: null,
};

export const getAllReservations = createAsyncThunk(
  "reservation/getAllReservations",
  async (params, { rejectWithValue }) => {
    const { locationId, clientType, dateRange, source, tableId, partySize } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (clientType) queryParams.append('clientType', clientType);
    if (dateRange) queryParams.append('dateRange', dateRange[0]);
    if (dateRange) queryParams.append('dateRange', dateRange[1]);
    if (source) queryParams.append('source', source);
    if (tableId) queryParams.append('tableId', tableId);
    if (partySize) queryParams.append('partySize', partySize);

    const { data, error } = await asyncHandler(() =>
      locationApi.get(`/${locationId}/reservations?${queryParams.toString()}`)
    );

    console.log("reservations", data.reservations)

    if (error) return rejectWithValue(error);
    return {
      reservations: data?.reservations?.map(r => ({
        bookingId: r._id,
        customerName: r.customer?.customerName,
        partySize: r.partySize,
        customerType: r.customer?.customerType,
        date: r.date?.slice(0, 10),
        time: r.time,
        table:`Table ${r.tableId[0]?.tableNumber}`,
        source: r.source,
        action: null,
        email: r.customer?.customerEmail,
        phone: r.customer?.customerPhone,
        zipCode: r.customer?.customerZipCode,
        allergies: r.allergies,
        specialRequests: r.specialRequests,
        status: r.status,
        tableId: r.tableId[0]?._id,
        tenantId: r.tenantId
      }))
    };
  }
);

export const getAllStaffReservations = createAsyncThunk(
  "reservation/getAllStaffReservations",
  async (params, { rejectWithValue }) => {
    const { locationId, staffId, clientType, dateRange, source, tableId, partySize } = params;

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (clientType) queryParams.append('clientType', clientType);
    if (dateRange) queryParams.append('dateRange', dateRange[0]);
    if (dateRange) queryParams.append('dateRange', dateRange[1]);
    if (source) queryParams.append('source', source);
    if (tableId) queryParams.append('tableId', tableId);
    if (partySize) queryParams.append('partySize', partySize);


    const { data, error } = await asyncHandler(() =>
      locationApi.get(`/${locationId}/staff/${staffId}/tableReservations?${queryParams.toString()}`)
    );

    if (error) return rejectWithValue(error);
    return {
      reservations: data?.reservations?.map(r => ({
        bookingId: r._id,
        customerName: r.customer?.customerName,
        partySize: r.partySize,
        customerType: r.customer?.customerType,
        date: new Date(r.date).toLocaleDateString().slice(0, 10),
        time: r.time,
        table: r.tableId,
        source: r.source,
        action: null
      }))
    };
  }
);


export const createReservation = createAsyncThunk(
  "reservation/createReservation",
  async ({ locationId, tableId, body }, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      reservationApi.post(`/locations/${locationId}/tables/${tableId}`, body)
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const editReservation = createAsyncThunk(
  "reservation/editReservation",
  async ({ bookingId, selectedStatus }, { rejectWithValue }) => {

    // Build query parameters
    const queryParams = new URLSearchParams();
    if (selectedStatus) queryParams.append('selectedStatus', selectedStatus);

    const { data, error } = await asyncHandler(() =>
      reservationApi.put(`/${bookingId}/status?${queryParams.toString()}`, '')
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);



const reservationSlice = createSlice({
  name: "reservation",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = false;
      state.userData = null;
      state.token = null;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("authStatus");
      localStorage.removeItem("userData");
      localStorage.removeItem("authToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllReservations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllReservations.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.allReservations = action.payload.reservations;

      })
      .addCase(getAllReservations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Fetching reservations failed";
      })

      //create reservation
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;

      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Creating reservation failed";
      })

      .addCase(editReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editReservation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.tenants = action.payload.tenants;

      })
      .addCase(editReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "editing reservation failed";
      })

  },
});

export const { logout, setToken, setCurrentUser } = reservationSlice.actions;

export default reservationSlice.reducer;
