import axios from "axios";
import {Base_URL }from "../../credentials";
import { toast } from "sonner";


const storedUserInfo = localStorage.getItem("userInfo");
let userInfo, userId;

try {
    userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;
    userId = userInfo?.userId;
} catch (error) {
    console.error("Failed to parse userInfo from localStorage:", error);
}

const userAxiosInstance = axios.create({
    baseURL: Base_URL,
    withCredentials: true,
    headers: userId ? { "userId": userId } : {}
});

userAxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.data === "User Blocked") {
            toast.error("Your account is blocked");
            return Promise.reject(error);
        }

        if (error.response?.status === 401) {
            originalRequest._retry = originalRequest._retry || false;

            if (!originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    await axios.post(`${Base_URL}/auth/refresh-Token`, {}, { withCredentials: true });
                    return userAxiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error("Refresh token error:", refreshError);
                    return Promise.reject(refreshError);
                }
            }
        }

        console.error("API error response:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default userAxiosInstance;
