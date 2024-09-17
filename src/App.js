import GuestRoute from 'general/components/AppRoutes/GuestRoute';
import PrivateRoute from 'general/components/AppRoutes/PrivateRoute';
import AppToast from 'general/components/AppToast';
import KTPageError01 from 'general/components/OtherKeenComponents/KTPageError01';
import DataCommonListener from 'general/listeners/DataCommonListener';
import EShip from 'modules/eShip';
import Authentication from 'modules/eShip/features/Auth';
import { Suspense, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// Load BS
require('bootstrap/dist/js/bootstrap.min');
// Load KT plugins
require('assets/plugins/ktutil');
require('assets/plugins/ktmenu');
require('assets/plugins/ktoffcanvas');
require('assets/plugins/ktcookie');
require('assets/plugins/kttoggle');
// aside
require('assets/plugins/aside/aside');
require('assets/plugins/aside/aside-menu');
require('assets/plugins/aside/aside-toggle');
// header
require('assets/plugins/header/ktheader-mobile');
require('assets/plugins/header/ktheader-topbar');

window.$ = window.jQuery = require('jquery');
window.moment = require('moment');

function App() {
  useEffect(() => {
    // if (process.env.REACT_APP_ENVIRONMENT === 'PROD') console.log = () => {};
  }, []);
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/*" element={<Navigate to="/e-ship" />} />

            <Route
              path="/e-ship/*"
              element={
                <PrivateRoute>
                  <EShip />
                </PrivateRoute>
              }
            />

            <Route
              path="/auth/*"
              element={
                <GuestRoute>
                  <Authentication />
                </GuestRoute>
              }
            />

            <Route path="*" element={<KTPageError01 />} />
          </Routes>
        </Suspense>
        <AppToast />
        <DataCommonListener />
      </BrowserRouter>
    </>
  );
}

export default App;
