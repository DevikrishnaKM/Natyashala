import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// import { toast } from 'sonner';
// import { clearAdmin } from '../slices/adminSlice'
import { Base_URL } from '../../credentials';

export const adminLogin = createAsyncThunk(
    'admin/authlogin',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
      try {
        const response = await axios.post(`${Base_URL}/admin/adminlogin`, { email, password });
        console.log("Admin login response: ", response.data);
  
        return response.data;
      } catch (error: any) {
        console.error("Admin login thunk error:", error.response?.data || error.message);
        return thunkAPI.rejectWithValue(error.response?.data || error.message);
      }
    }
  );
  