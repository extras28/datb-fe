import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Route, Routes } from 'react-router-dom';
import EmployeeHomePage from './screens/EmployeeHomePage';

Employee.propTypes = {};

function Employee(props) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="home" />} />
      <Route path="home/*" element={<EmployeeHomePage />} />
    </Routes>
  );
}

export default Employee;
