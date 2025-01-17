import axios from "axios";
import {Base_URL }from "../../credentials";
import { toast } from "sonner";
import { decrypt } from "@/utils/encryption";


const storedEncryptedTutorInfo = localStorage.getItem("tutorInfo");
console.log("testing...", storedEncryptedTutorInfo);

let tutorInfo, userId;



try {
    // Decrypt the stored encrypted data
    if (storedEncryptedTutorInfo) {
        tutorInfo = decrypt(storedEncryptedTutorInfo);  // Decrypt the tutorInfo
        console.log("userInstance:", tutorInfo);
        userId = tutorInfo?.userId;  // Extract the userId from decrypted tutorInfo
    }
} catch (error) {
    console.error("Failed to decrypt tutorInfo from localStorage:", error);
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
