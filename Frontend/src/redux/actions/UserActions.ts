import axios from "axios";
import { Base_URL } from "../../credentials";
import { User } from "../../Types/user";
import { AppDispatch } from '../../redux/store';

export const registerUser = (userData: User, role: string | null) => {
    return async (dispatch: AppDispatch): Promise<boolean | any> => {
      try {
        const response = await axios.post(
          `${Base_URL}/auth/signup?role=${role}`,
          userData
        );
        console.log(response, "this is response");
        if (response.data.status === true) {
          localStorage.setItem("userEmail", userData.email);
          return true;
        }
        return response;
      } catch (error: any) {
        if (error.response?.status === 409) {
          console.error("Email already in use");
          return false;
        } else {
          throw error;
        }
      }
    };
  };