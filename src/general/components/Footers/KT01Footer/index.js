import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AppConfigs from 'general/constants/AppConfigs';
import { useDispatch, useSelector } from 'react-redux';
import { setEnvironment } from 'app/appSlice';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import { updateAxiosBaseURL } from 'api/axiosClient';
import UserHelper from 'general/helpers/UserHelper';

KT01Footer.propTypes = {};

function KT01Footer(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const initialEnvironment = useRef(
    localStorage.getItem(PreferenceKeys.savedEnvironment) ??
      (process.env.REACT_APP_ENVIRONMENT || 'DEV')
  );

  // MARK: --- Functions ---
  function handleChangeEnvironment() {
    let environment = initialEnvironment;
    if (initialEnvironment.current === 'DEV') {
      environment = 'PROD';
    } else {
      environment = 'DEV';
    }

    localStorage.setItem(PreferenceKeys.savedEnvironment, environment);
    const env = process.env.REACT_APP_ENVIRONMENT || 'DEV';
    console.log(env, process.env.REACT_APP_BASE_URL, process.env.REACT_APP_BASE_URL_SWITCH);
    if (environment === 'DEV') {
      if (env === 'DEV') {
        updateAxiosBaseURL(process.env.REACT_APP_BASE_URL);
      } else {
        updateAxiosBaseURL(process.env.REACT_APP_BASE_URL_SWITCH);
      }
    } else {
      if (env === 'DEV') {
        updateAxiosBaseURL(process.env.REACT_APP_BASE_URL_SWITCH);
      } else {
        updateAxiosBaseURL(process.env.REACT_APP_BASE_URL);
      }
    }
    UserHelper.signOut();
    window.location.href = '/sign-in';
  }

  return (
    <div id="kt_footer" className="footer bg-transparent py-4 d-flex flex-lg-column zindex-1">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-center">
        {/* copyright */}
        {/* <div className="text-dark order-2 order-md-1">
          <span className="text-dark font-weight-bold mr-2">© eShip by</span>
          <span className="text-dark-75">MobiFone</span>
          <a
            className="text-primary font-weight-bold"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleChangeEnvironment();
            }}
          >
            <span className="ml-2">({`${t('Environment')}: ${initialEnvironment.current}`})</span>
          </a>
        </div> */}
      </div>
    </div>
  );
}

export default KT01Footer;
