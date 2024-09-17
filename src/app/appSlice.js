import { createSlice } from '@reduxjs/toolkit';

// MARK: --- Thunks ---

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    environment: process.env.REACT_APP_ENVIRONMENT || 'DEV',
  },
  reducers: {
    setEnvironment: (state, action) => {
      state.environment = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

const { reducer, actions } = appSlice;
export const { setEnvironment } = actions;
export default reducer;
