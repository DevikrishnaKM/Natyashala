import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfo {
  userId: string | number; // Replace with the correct type for userId
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthState {
  accessToken: string | null;
  userInfo: UserInfo | null;
}

const initialState: AuthState = {
  accessToken: null,
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; userInfo: UserInfo }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.userInfo = action.payload.userInfo;
    },
    clearCredentials: (state) => {
      state.accessToken = null;
      state.userInfo = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
