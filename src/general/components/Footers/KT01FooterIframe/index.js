import { updateAxiosBaseURL } from 'api/axiosClient';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import Utils from 'general/utils/Utils';
import useRouter from 'hooks/useRouter';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

KT01FooterIframe.propTypes = {};

function KT01FooterIframe(props) {
  // MARK: --- Params ---
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const initialEnvironment = useRef(
    localStorage.getItem(PreferenceKeys.savedEnvironment) ??
      (process.env.REACT_APP_ENVIRONMENT || 'DEV')
  );
  const router = useRouter();
  const { query } = router;
  const { username, password } = query;
  const decodedPassword = Utils.UnicodeDecodeB64(password);
  const [flag, setFlag] = useState({});

  async function requestSignIn(username, password) {
    const params = {
      username,
      password,
    };
    try {
    } catch (error) {
      console.log({ error });
    }
  }

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
    initialEnvironment.current = environment;
    setFlag({});
    requestSignIn(username, decodedPassword);
  }

  return (
    <div id="kt_footer" className="footer bg-transparent py-4 d-flex flex-lg-column zindex-1">
      <div className="container d-flex flex-column flex-md-row align-items-center justify-content-center">
        {/* copyright */}
        <div className="text-dark order-2 order-md-1">
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
        </div>
      </div>
    </div>
  );
}

export default KT01FooterIframe;
