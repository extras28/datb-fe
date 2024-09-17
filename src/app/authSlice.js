import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import authApi from 'api/authApi';
import { updateAxiosAccessToken } from 'api/axiosClient';
import PreferenceKeys from 'general/constants/PreferenceKeys';
import ToastHelper from 'general/helpers/ToastHelper';
import UserHelper from 'general/helpers/UserHelper';

// MARK: --- Thunks ---

export const thunkSignIn = createAsyncThunk('auth/sign-in', async (params, thunkApi) => {
  const res = await authApi.signIn(params);
  return res;
});

export const thunkSignOut = createAsyncThunk('auth/sign-out', async () => {
  const res = await authApi.signOut();
  return res;
});

export const thunkGetAccountInfor = createAsyncThunk('account/get-account-infor', async () => {
  const res = await authApi.getAccountInfor();
  return res;
});

export const authSlice = createSlice({
  name: 'app',
  initialState: {
    isSigningIn: false,
    current: {},
    isFirstTimeLogin: false,
    isGettingAccountInfor: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // MARK: ---- THUNK SIGN IN ----
    builder.addCase(thunkSignIn.pending, (state, action) => {
      state.isSigningIn = true;
    });
    builder.addCase(thunkSignIn.rejected, (state, action) => {
      state.isSigningIn = false;
    });
    builder.addCase(thunkSignIn.fulfilled, (state, action) => {
      const { result, account, accessToken, accessTokenExpireDate, firstTimeLogIn } =
        action?.payload;
      state.isSigningIn = false;
      if (result === 'success' && account?.role == 'ADMIN') {
        localStorage.setItem(PreferenceKeys.accessToken, accessToken);
        localStorage.setItem(PreferenceKeys.accessTokenExpired, accessTokenExpireDate);
        updateAxiosAccessToken(accessToken);
        state.current = account;
        state.isFirstTimeLogin = firstTimeLogIn;
      } else if (account.role != 'ADMIN') {
        ToastHelper.showError('Không đủ quyền truy cập');
      }
    });

    // MARK: ---- THUNK SIGN OUT ---
    builder.addCase(
      thunkSignOut.fulfilled, // Sign out
      (state, action) => {
        const { data, errors } = action.payload;
        if (data) {
          state.current = {};
          localStorage.setItem(PreferenceKeys.permission, '');
        }
        UserHelper.signOut();
        window.location.href = '/sign-in';
      }
    );

    // MARK: ---- THUNK GET ACCOUNT INFORMATION ----
    builder.addCase(thunkGetAccountInfor.pending, (state, action) => {
      state.isSigningIn = true;
    });
    builder.addCase(thunkGetAccountInfor.rejected, (state, action) => {
      state.isSigningIn = false;
    });
    builder.addCase(thunkGetAccountInfor.fulfilled, (state, action) => {
      const { result, account } = action.payload;
      state.isSigningIn = false;
      if (result === 'success') {
        state.current = account;
      }
    });
  },
});

const { reducer, actions } = authSlice;
export const {} = actions;
export default reducer;
