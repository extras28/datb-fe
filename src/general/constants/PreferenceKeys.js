import AppConfigs from "./AppConfigs";

// All app preference keys
const PreferenceKeys = {
  // token
  accessToken: `${AppConfigs.packageName}_accessToken`,
  accessTokenExpired: `${AppConfigs.packageName}_accessTokenExpired`,
};

export default PreferenceKeys;
