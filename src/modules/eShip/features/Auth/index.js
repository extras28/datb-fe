import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import SignInScreen from './screens/SignInScreen';
import AuthenticationBaseLayout from './components/AutheticationBaseLayout';
import ToastHelper from 'general/helpers/ToastHelper';
import PreferenceKeys from 'general/constants/PreferenceKeys';

Authentication.propTypes = {};

function Authentication(props) {
  return (
    <AuthenticationBaseLayout>
      <Routes>
        <Route path="/" element={<Navigate to="sign-in" />} />
        <Route path="sign-in/*" element={<SignInScreen />} />
      </Routes>
    </AuthenticationBaseLayout>
  );
}

export default Authentication;
