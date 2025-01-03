import { createAsyncThunk } from '@reduxjs/toolkit';
import { setCredentials, clearCredentials } from '../slices/authSlice';
import userAxiosInstance from '../../config/axiosInstance.ts/userInstance'
import  {RootState}  from '../store';
import { Base_URL } from '../../credentials';

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { userInfo } = state.auth;

      if (!userInfo) {
        dispatch(clearCredentials());
        return rejectWithValue('User information is missing.');
      }

      // Make the request to refresh the token
      const response = await userAxiosInstance.post(
        `${Base_URL}/auth/refresh-token`,
        {},
        { withCredentials: true }
      );

      // Dispatch the updated credentials
      dispatch(
        setCredentials({
          accessToken: response.data.accessToken,
          userInfo,
        })
      );

      return response.data.accessToken;
    } catch (error: any) {
      dispatch(clearCredentials());
      console.error('Error refreshing token:', error);
      return rejectWithValue(error.response?.data || 'Failed to refresh token');
    }
  }
);
