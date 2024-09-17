import PreferenceKeys from 'general/constants/PreferenceKeys';
import moment from 'moment';

const AccountHelper = {
  getAccessToken: () => {
    return localStorage.getItem(PreferenceKeys.accessToken);
  },

  // kiem tra access token hop le
  checkAccessTokenValid: () => {
    const accessToken = AccountHelper.getAccessToken();
    const accessTokenExpireDate = AccountHelper.getAccessTokenExpireDate();
    if (accessToken && accessTokenExpireDate) {
      const momentNow = moment();
      const momentExpired = moment(accessTokenExpireDate);
      return momentExpired.isAfter(momentNow);
    }

    return false;
  },

  getAccessTokenExpireDate: () => {
    return localStorage.getItem(PreferenceKeys.accessTokenExpired);
  },
};

export default AccountHelper;
