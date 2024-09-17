import receiptApi from 'api/receiptApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListReceipt = createAsyncThunk('receipt/list', async (params, thunkApi) => {
  const res = await receiptApi.getListReceipt(params);
  return res;
});

const receiptSlice = createSlice({
  name: 'receipt',
  initialState: {
    receipts: [],
    isGettingReceipt: false,
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
    // get list receipt
    builder.addCase(thunkGetListReceipt.pending, (state, action) => {
      state.isGettingReceipt = true;
    });
    builder.addCase(thunkGetListReceipt.rejected, (state, action) => {
      state.isGettingReceipt = false;
    });
    builder.addCase(thunkGetListReceipt.fulfilled, (state, action) => {
      state.isGettingReceipt = false;
      const { result, receipts, total, count, page } = action.payload;
      if (result == 'success') {
        state.receipts = receipts;
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
const { reducer, actions } = receiptSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
