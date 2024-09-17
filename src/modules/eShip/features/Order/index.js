import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import OrderHomeScreen from './screens/OrderHomeScreen';

Order.propTypes = {};

function Order(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home/*" element={<OrderHomeScreen />} />
    </Routes>
  );
}

export default Order;
