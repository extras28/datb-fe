import { removeAxiosAccessToken } from 'api/axiosClient';
import AppResource from 'general/constants/AppResource';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import Utils from 'general/utils/Utils';

const UserHelper = {
  // Get display name
  getDisplayName: (user) => {
    if (user && user.displayName && user.displayName !== 'null') {
      return user.displayName;
    }
    return user?.fullname;
  },

  // Get display name and phone
  getDisplayNameAndPhone: (user) => {
    let displayName = '';
    if (user) {
      displayName = user.fullname ?? user.username;

      if (user.phone) {
        displayName = displayName.concat(` - ${user.phone}`);
      }
    }
    return displayName;
  },

  // Check api key valid
  checkApiKeyValid: () => {
    // return true;
    const apiKey = localStorage.getItem(PreferenceKeys.apiKey);

    if (apiKey) {
      return true;
    }

    return false;
  },

  // Sign out
  // dang xuat
  signOut: () => {
    localStorage.removeItem(PreferenceKeys.accessToken);
    localStorage.removeItem(PreferenceKeys.accessTokenExpired);
    // store.dispatch(thunkSignOut());
    // store.dispatch(authSignOut());
    // store.dispatch(organizationSignOut());
    // store.dispatch(systemSignOut());
    // store.dispatch(notificationSignOut());
    // store.dispatch(axionSignOut());
    removeAxiosAccessToken();
    // wsHelperInstance.logout();
  },

  getAccountAvatar: (account) => {
    const avatar = account?.logo;
    if (avatar) {
      return Utils.getFullUrl(avatar);
    } else {
      return AppResource.images.imgDefaultLogo;
    }
  },
};

export default UserHelper;
