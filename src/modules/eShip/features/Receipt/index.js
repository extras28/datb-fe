import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import ReceiptHomeScreen from './screens/ReceiptHomeScreen';

Receipt.propTypes = {};

function Receipt(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home/*" element={<ReceiptHomeScreen />} />
    </Routes>
  );
}

export default Receipt;
