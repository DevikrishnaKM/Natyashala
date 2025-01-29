
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { login, updateUserInfo  } from '../actions/UserActions';
import { toast } from 'sonner';
// import { SrvRecord } from 'dns';
import { encrypt } from "../../utils/encryption.js";

interface User {
  userId: string;
  name: string;
  phone : string;
  email: string;
  role:"user"|"tutor"
  isVerified: boolean;
}

interface UserState {
  userInfo: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  userInfo:null,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser(state) {
      state.userInfo = null;
      state.accessToken = null;
      state.refreshToken = null;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken, userInfo } = action.payload; // TypeScript infers the correct type here
        console.log(action.payload, "user payload");
  
        state.userInfo = userInfo;
        state.accessToken = accessToken;
        state.loading = false;
         console.log(state.userInfo,"sss")
        
        localStorage.setItem('accessToken', accessToken);
       
        if(userInfo.role=="user"){

          const encryptedData = encrypt(userInfo);
           
          localStorage.setItem('userInfo', encryptedData);
        }else{
          const encryptedData = encrypt(userInfo);
        
          localStorage.setItem('tutorInfo', encryptedData);

        }
       
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ? String(action.payload) : 'Login failed. Please try again.';
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserInfo.fulfilled, (state, action: PayloadAction<User | 'no change'>) => {
        if (action.payload === 'no change') {
          toast.warning('No changes made.');
        } else {
          state.userInfo = action.payload;
          state.loading = false;
        }
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
  },
  
  
});

export const { clearUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;
