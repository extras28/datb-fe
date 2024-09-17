import employeeApi from 'api/employeeApi';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Global from 'general/utils/Global';

// MARK ---- thunks ---
export const thunkGetListEmployee = createAsyncThunk('employee/list', async (params, thunkApi) => {
  const res = await employeeApi.getListEmployee(params);
  return res;
});

const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    isGettingEmployee: false,
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
    // get list employee
    builder.addCase(thunkGetListEmployee.pending, (state, action) => {
      state.isGettingEmployee = true;
    });
    builder.addCase(thunkGetListEmployee.rejected, (state, action) => {
      state.isGettingEmployee = false;
    });
    builder.addCase(thunkGetListEmployee.fulfilled, (state, action) => {
      state.isGettingEmployee = false;
      const { result, employees, total, count, page } = action.payload;
      if (result == 'success') {
        state.employees = employees;
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
const { reducer, actions } = employeeSlice;
export const { setPaginationPerPage } = actions;
export default reducer;
