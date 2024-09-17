import orderApi from 'api/orderApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListOrder = createAsyncThunk('order/list', async (params, thunkApi) => {
  const res = await orderApi.getListOrder(params);
  return res;
});

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    isGettingOrder: false,
    pagination: { perPage: Global.gDefaultPagination },
  },
  reducers: {
    setPaginationPerPage: (state, action) => {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          perPage: action.payload,
        },
      };
    },
  },
  extraReducers: (builder) => {
    // get list order
    builder.addCase(thunkGetListOrder.pending, (state, action) => {
      state.isGettingOrder = true;
    });
    builder.addCase(thunkGetListOrder.rejected, (state, action) => {
      state.isGettingOrder = false;
    });
    builder.addCase(thunkGetListOrder.fulfilled, (state, action) => {
      state.isGettingOrder = false;
      const { result, orders, total, count, page } = action.payload;
      if (result == 'success') {
        state.orders = orders;
        state.pagination = {
          ...state.pagination,
          total: total,
          count: count,
          currentPage: page + 1,
        };
      }
    });
  },
});
const { reducer, actions } = orderSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
