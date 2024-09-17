import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import ShipperHomeScreen from './screens/ShipperHomeScreen';

Shipper.propTypes = {};

function Shipper(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home/*" element={<ShipperHomeScreen />} />
    </Routes>
  );
}

export default Shipper;
