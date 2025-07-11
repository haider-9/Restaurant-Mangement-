import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../../config/api";
import asyncHandler from "../../../utils/asyncHandler";


const initialState = {
  plans: null,
  loading: false,
  error: null,
};


export const getPlans = createAsyncThunk(
  "plan/getPlans",
  async (credentials, { rejectWithValue }) => {
    const planApi = new Api("api/plans")
    const { data, error } = await asyncHandler(() =>
      planApi.get('', credentials) 
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const deletePlan = createAsyncThunk(
  "plan/deletePlan",
  async (id, { rejectWithValue }) => {
    const planApi = new Api(`api/plans`)
    const { data, error } = await asyncHandler(() =>
      planApi.delete('', id) 
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);

export const editPlan = createAsyncThunk(
  "plan/editPlan",
  async (payload, id, { rejectWithValue }) => {
    const planApi = new Api(`api/plans`)
    const { data, error } = await asyncHandler(() =>
      planApi.put('', id, payload) 
    );

    if (error) return rejectWithValue(error);
    return data;
  }
);


const planSlice = createSlice({
  name: "plan",
  initialState,
  reducers: {
    logout: (state) => {
      state.status = false;
      state.userData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        state.plans = action.payload.plans;

      })
      .addCase(getPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Fetching plans failed" };
      })

    //   edit plan
      .addCase(editPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.plans = action.payload.plans;

      })
      .addCase(editPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Updating plan failed" };
      })

    //   delete plan
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.status = true;
        // state.plans = action.payload.plans;

      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || { message: "Updating plan failed" };
      })

  },
});

export const { logout, setToken, setCurrentUser } = planSlice.actions;

export default planSlice.reducer;
