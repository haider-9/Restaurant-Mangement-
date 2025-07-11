import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../../config/api";
import tenantApi from "../../../config/tenantApi";
import locationApi from "../../../config/locationApi";
import asyncHandler from "../../../utils/asyncHandler";


const initialState = {
  locations: null,
  loading: false,
  error: null,
};


export const getLocations = createAsyncThunk(
  "location/getLocations",
  async (id, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      locationApi.get(`/all/tenants/${id}`) 
    );

    if (error) return rejectWithValue(error);
    // console.log('data', data)
    return data;
  }
);

export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (id, payload, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      tenantApi.post(`/${id}/locations`, payload) 
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (tenantId, locationId, { rejectWithValue }) => {
    const { data, error } = await asyncHandler(() =>
      tenantApi.delete(`/${tenantId}/locations/${locationId}`) 
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);



const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = false;
      state.userData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.locations = action.payload.locations;

      })
      .addCase(getLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Fetching locations failed" };
      })

    //   create location
      .addCase(createLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;

      })
      .addCase(createLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Creating location failed" };
      })

    //   delete location
      .addCase(deleteLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.plans = action.payload.plans;

      })
      .addCase(deleteLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Deleting location failed" };
      })

  },
});

export const { logout, setToken, setCurrentUser } = locationSlice.actions;

export default locationSlice.reducer;
