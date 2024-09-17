// Import reducers
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './appSlice';
import authReducer from './authSlice';
import employeeReducer from '../modules/eShip/features/Employee/employeeSlice';
import shipperReducer from '../modules/eShip/features/Shipper/shipperSlice';
import postOfficeReducer from '../modules/eShip/features/PostOffice/postOfficeSlice';
import orderReducer from '../modules/eShip/features/Order/orderSlice';
import receiptReducer from '../modules/eShip/features/Receipt/receiptSlice';
import dashboardReducer from '../modules/eShip/features/Dashboard/dashboardSlice';

// root reducer
const rootReducer = {
  app: appReducer,
  auth: authReducer,
  employee: employeeReducer,
  shipper: shipperReducer,
  postOffice: postOfficeReducer,
  order: orderReducer,
  receipt: receiptReducer,
  dashboard: dashboardReducer,
};

// app store

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.REACT_APP_DEV_TOOLS == 1 ? true : false,
});

export default store;
