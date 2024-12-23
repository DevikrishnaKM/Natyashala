import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { adminLogin } from '../actions/adminActions';

interface Admin {
  adminAccessToken: string;
  adminRefreshToken : string;
}

interface AdminState {
  adminInfo: Admin | null;
  loading: boolean;
  error: string | null; 
}

const initialState: AdminState = {
  adminInfo: null,
  loading: false,
  error: null, 
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdmin(state) {
      state.adminInfo = null;
      state.error = null; 
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null; 
      })
      .addCase(adminLogin.fulfilled, (state, action: PayloadAction<Admin>) => {
        console.log("payload in slice" , action.payload)
        state.adminInfo = action.payload;
        state.loading = false;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Login failed'; 
      });

      
  },
});

export const { clearAdmin, setLoading } = adminSlice.actions;
export default adminSlice.reducer;