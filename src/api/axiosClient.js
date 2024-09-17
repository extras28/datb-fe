import axios from 'axios';
import AccountHelper from 'general/helpers/AccountHelper';
import ToastHelper from 'general/helpers/ToastHelper';
import UserHelper from 'general/helpers/UserHelper';
import Utils from 'general/utils/Utils';
import queryString from 'query-string';

const sTag = '[AxiosClient]';

const baseURL = Utils.getBaseApiUrl();

const axiosClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  console.log(
    `${sTag} - ${config.baseURL}${config.url}, ${config.method}, ${
      config.method === 'post' ? JSON.stringify(config.data) : JSON.stringify(config.params)
    }`
  );
  console.log(`${sTag} - headers: ${JSON.stringify(config?.headers.common)}`);
  // if (config.method === 'post') {
  //   config.headers['Content-Type'] = 'multipart/form-data';
  // }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    const { data, errors } = response.data;

    if (response.headers['session-token'])
      axiosClient.defaults.headers.common['session-token'] = response.headers['session-token'];

    if (errors) {
      ToastHelper.showError(errors[0].message);
      return response.data;
    }

    if (response && response.data) {
      return response.data;
    }

    return response;
  },
  (error) => {
    console.log(`${sTag} - ${error}`);
    const response = error.response;
    if (response && (response.status === 403 || response.status === 401)) {
      console.log({ response });
      UserHelper.signOut();
      window.location.href = '/auth/sign-in';
      return;
    }
    if (response && response.data) {
      const data = response.data;
      const { result, reason } = data;
      if (result === 'failed') {
        if (reason) {
          if (Array.isArray(reason)) {
            reason?.forEach(ToastHelper.showError);
          } else {
            if (reason) ToastHelper.showError(reason);
            else ToastHelper.showError(error.message);
          }
        }
      }
    }

    throw error;
  }
);

// Update base url
const updateAxiosBaseURL = (baseUrl) => {
  axiosClient.defaults.baseURL = baseUrl;
};

// Update access token
const updateAxiosAccessToken = (accessToken) => {
  axiosClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

// Remove access token
const removeAxiosAccessToken = () => {
  delete axiosClient.defaults.headers.common['Authorization'];
};

(() => {
  const isTokenValid = AccountHelper.checkAccessTokenValid();
  if (isTokenValid) {
    const token = AccountHelper.getAccessToken();
    updateAxiosAccessToken(token);
  }
})();

export { removeAxiosAccessToken, updateAxiosAccessToken, updateAxiosBaseURL };

export default axiosClient;
