import postOfficeApi from 'api/postOfficeApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListPostOffice = createAsyncThunk(
  'postOffice/list',
  async (params, thunkApi) => {
    const res = await postOfficeApi.getListPostOffice(params);
    return res;
  }
);

const postOfficeSlice = createSlice({
  name: 'postOffice',
  initialState: {
    postOffices: [],
    isGettingPostOffice: false,
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
    // get list postOffice
    builder.addCase(thunkGetListPostOffice.pending, (state, action) => {
      state.isGettingPostOffice = true;
    });
    builder.addCase(thunkGetListPostOffice.rejected, (state, action) => {
      state.isGettingPostOffice = false;
    });
    builder.addCase(thunkGetListPostOffice.fulfilled, (state, action) => {
      state.isGettingPostOffice = false;
      const { result, postOffices, total, count, page } = action.payload;
      if (result == 'success') {
        state.postOffices = postOffices;
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
const { reducer, actions } = postOfficeSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
