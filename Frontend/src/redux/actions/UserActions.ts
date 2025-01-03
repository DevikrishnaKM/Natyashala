import axios from "axios";
import { Base_URL } from "../../credentials";
import { User } from "../../Types/user";
import { AppDispatch } from "../../redux/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";

interface UpdateUserInfoPayload {
  userId: string;
  name?: string;
  phone?: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  otp: string;
  role: "user" | "tutor";
}
export const registerUser = (userData: User, role: string | null) => {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${Base_URL}/auth/signup?role=${role}`,
        userData
      );

      // console.log("API Response:", response);

      if (response.data.status === "success") {
        if (userData.email) {
          localStorage.setItem("userEmail", userData.email);
          console.log("Email stored in localStorage:", userData.email);
        } else {
          console.error(
            "Email is undefined or null, skipping localStorage save."
          );
        }
        return true; // Registration succeeded
      }

      console.error("Registration failed:", response);
      return false; // Registration failed
    } catch (error: any) {
      if (error.response?.status === 409) {
        console.error("Email already in use");
        return false; // Email conflict
      } else {
        console.error("An unexpected error occurred:", error);
        throw error; // Re-throw unexpected errors
      }
    }
  };
};

export const verifyOtp = (formData: FormData) => {
  return async (dispatch: AppDispatch): Promise<boolean> => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) {
        console.error("Email not found in localStorage");
        return false;
      }

      const response = await axios.post(
        `${Base_URL}/auth/otpVerification`,
        formData
      );
      console.log(response);
      if (response.data.message === "OTP verified") {
        localStorage.clear();
        return true;
      }
    } catch (error: any) {
      console.error("Error during OTP verification:", error);

      if (error.response?.data?.message) {
        switch (error.response.data.message) {
          case "Wrong OTP":
            console.log("Wrong OTP entered");
            return false;
          case "OTP expired or not found":
            console.log("OTP expired or not found");
            return false;
          default:
            console.log(
              "Unexpected error message:",
              error.response.data.message
            );
            return false;
        }
      } else {
        console.log("Unexpected error structure", error);
        return false;
      }
    }
  };
};
export const resendOtp = createAsyncThunk<boolean>(
  "user/resendOtp",
  async (_, { rejectWithValue }) => {
    try {
      const email = localStorage.getItem("userEmail");
      if (!email) throw new Error("No email found in localStorage");

      const response = await axios.post(`${Base_URL}/auth/resendOtp`, {
        email,
      });
      return response.status === 200;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to resend OTP");
    }
  }
);

export const login = createAsyncThunk<
  { accessToken: string; userInfo: User }, // Success payload
  { email: string; password: string }, // Thunk argument
  { rejectValue: string } // Rejected payload
>("user/authLogin", async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${Base_URL}/auth/verifyLogin`,
      { email, password },
      { withCredentials: true }
    );
    console.log("Response:", response, response.data.cred);
    const cred = response.data.cred;
    return {
      accessToken: cred.accessToken,
      userInfo: cred.userInfo,
    };
  } catch (error: any) {
    // Handle errors gracefully
    console.error("Login error:", error);
    return rejectWithValue(error.response?.data.message || "Login failed");
  }
});
export const updateUserInfo = createAsyncThunk<
  User | "no change",
  UpdateUserInfoPayload
>("user/updateUserInfo", async (userData, { rejectWithValue }) => {
  try {
    const response = await userAxiosInstance.put(
      `${Base_URL}/auth/edituser`,
      userData
    );
    if (response.data.message === "No changes found") {
      return "no change";
    }
    return response.data.data as User;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Update failed");
  }
});
