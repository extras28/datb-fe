import shipperApi from 'api/shipperApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListShipper = createAsyncThunk('shipper/list', async (params, thunkApi) => {
  const res = await shipperApi.getListShipper(params);
  return res;
});

const shipperSlice = createSlice({
  name: 'shipper',
  initialState: {
    shippers: [],
    isGettingShipper: false,
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
    // get list shipper
    builder.addCase(thunkGetListShipper.pending, (state, action) => {
      state.isGettingShipper = true;
    });
    builder.addCase(thunkGetListShipper.rejected, (state, action) => {
      state.isGettingShipper = false;
    });
    builder.addCase(thunkGetListShipper.fulfilled, (state, action) => {
      state.isGettingShipper = false;
      const { result, shippers, total, count, page } = action.payload;
      if (result == 'success') {
        state.shippers = shippers;
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
const { reducer, actions } = shipperSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
