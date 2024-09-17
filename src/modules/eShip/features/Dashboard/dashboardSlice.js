import dashboardApi from 'api/dashboardApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetStatisticByDate = createAsyncThunk(
  'dashboard/handed-over',
  async (params, thunkApi) => {
    const res = await dashboardApi.getStatisticByDate(params);
    return res;
  }
);
export const thunkGetScannedOrderStatisticByDate = createAsyncThunk(
  'dashboard/scanned',
  async (params, thunkApi) => {
    const res = await dashboardApi.getStatisticByDate(params);
    return res;
  }
);
export const thunkGetStatisticByEmployee = createAsyncThunk(
  'dashboard/order-by-employee',
  async (params, thunkApi) => {
    const res = await dashboardApi.getStatisticByEmployee(params);
    return res;
  }
);
export const thunkGetStatisticByPostOffice = createAsyncThunk(
  'dashboard/order-by-post-office',
  async (params, thunkApi) => {
    const res = await dashboardApi.getStatisticByPostOffice(params);
    return res;
  }
);
export const thunkGetStatisticThisMonth = createAsyncThunk(
  'dashboard/this-month',
  async (params, thunkApi) => {
    const res = await dashboardApi.getStatisticThisMonth(params);
    return res;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    statisticByDate: [],
    isGettingStatisticByDate: false,

    scannedOrderStatisticByDate: [],
    isGettingScannedOrderStatisticByDate: false,

    isGettingStatisticThisMonth: false,
    thisMonthStatistic: {
      total: { thisMonth: 0, growth: 0 },
      scanned: { thisMonth: 0, growth: 0 },
      readyToShip: { thisMonth: 0, growth: 0 },
      handedOver: { thisMonth: 0, growth: 0 },
      cancelled: { thisMonth: 0, growth: 0 },
      returned: { thisMonth: 0, growth: 0 },
    },

    isGettingStatisticByEmployee: false,
    statisticByEmployee: [],

    isGettingStatisticByPostOffice: false,
    statisticByPostOffice: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    // get statistic by date
    builder.addCase(thunkGetStatisticByDate.pending, (state, action) => {
      state.isGettingStatisticByDate = true;
    });
    builder.addCase(thunkGetStatisticByDate.rejected, (state, action) => {
      state.isGettingStatisticByDate = false;
    });
    builder.addCase(thunkGetStatisticByDate.fulfilled, (state, action) => {
      state.isGettingStatisticByDate = false;
      const { result, series } = action.payload;
      if (result == 'success') {
        state.statisticByDate = series;
      }
    });

    // get scanned order statistic by date
    builder.addCase(thunkGetScannedOrderStatisticByDate.pending, (state, action) => {
      state.isGettingScannedOrderStatisticByDate = true;
    });
    builder.addCase(thunkGetScannedOrderStatisticByDate.rejected, (state, action) => {
      state.isGettingScannedOrderStatisticByDate = false;
    });
    builder.addCase(thunkGetScannedOrderStatisticByDate.fulfilled, (state, action) => {
      state.isGettingScannedOrderStatisticByDate = false;
      const { result, series } = action.payload;
      if (result == 'success') {
        state.scannedOrderStatisticByDate = series;
      }
    });

    // get statistic by employee
    builder.addCase(thunkGetStatisticByEmployee.pending, (state, action) => {
      state.isGettingStatisticByEmployee = true;
    });
    builder.addCase(thunkGetStatisticByEmployee.rejected, (state, action) => {
      state.isGettingStatisticByEmployee = false;
    });
    builder.addCase(thunkGetStatisticByEmployee.fulfilled, (state, action) => {
      state.isGettingStatisticByEmployee = false;
      const { result, series } = action.payload;
      if (result == 'success') {
        state.statisticByEmployee = series;
      }
    });

    // get statistic by post office
    builder.addCase(thunkGetStatisticByPostOffice.pending, (state, action) => {
      state.isGettingStatisticByPostOffice = true;
    });
    builder.addCase(thunkGetStatisticByPostOffice.rejected, (state, action) => {
      state.isGettingStatisticByPostOffice = false;
    });
    builder.addCase(thunkGetStatisticByPostOffice.fulfilled, (state, action) => {
      state.isGettingStatisticByPostOffice = false;
      const { result, series } = action.payload;
      if (result == 'success') {
        state.statisticByPostOffice = series;
      }
    });

    // get statistic this month
    builder.addCase(thunkGetStatisticThisMonth.pending, (state, action) => {
      state.isGettingStatisticThisMonth = true;
    });
    builder.addCase(thunkGetStatisticThisMonth.rejected, (state, action) => {
      state.isGettingStatisticThisMonth = false;
    });
    builder.addCase(thunkGetStatisticThisMonth.fulfilled, (state, action) => {
      state.isGettingStatisticThisMonth = false;
      const { result, total, scanned, readyToShip, handedOver, cancelled, returned } =
        action.payload;
      if (result == 'success') {
        state.thisMonthStatistic.total = total;
        state.thisMonthStatistic.scanned = scanned;
        state.thisMonthStatistic.readyToShip = readyToShip;
        state.thisMonthStatistic.handedOver = handedOver;
        state.thisMonthStatistic.cancelled = cancelled;
        state.thisMonthStatistic.returned = returned;
      }
    });
  },
});
const { reducer, actions } = dashboardSlice;
export const {} = actions;
export default reducer;
