import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import KT01BaseLayout from 'general/components/BaseLayout/KT01BaseLayout';
import { Navigate, Route, Routes } from 'react-router-dom';
import Employee from './features/Employee';
import Shipper from './features/Shipper';
import PostOffice from './features/PostOffice';
import Order from './features/Order';
import Receipt from './features/Receipt';
import Dashboard from './features/Dashboard';

EShip.propTypes = {};

function EShip(props) {
  // MARK: --- props ---
  const { t } = useTranslation();

  return (
    <KT01BaseLayout>
      <div id="e-ship-container" className="container-fluid min-h-100">
        <Routes>
          <Route path="/" element={<Navigate to="statistic" />} />
          <Route path="/employee/*" element={<Employee />} />
          <Route path="/shipper/*" element={<Shipper />} />
          <Route path="/post-office/*" element={<PostOffice />} />
          <Route path="/order/*" element={<Order />} />
          <Route path="/receipt/*" element={<Receipt />} />
          <Route path="/statistic/*" element={<Dashboard />} />
        </Routes>
      </div>
    </KT01BaseLayout>
  );
}

export default EShip;
