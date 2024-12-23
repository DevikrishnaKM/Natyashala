
import { useState, useEffect } from 'react'
import { Toaster, toast } from 'sonner'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { useDispatch} from 'react-redux'
import { verifyOtp } from '../../redux/actions/UserActions'
import { AppDispatch } from '../../redux/store'
import Navbar from '@/components/common/UserCommon/NavBar'
import {User} from "../../Types/user"

interface OtpFormProps {
  values: User;
  role: 'user'|'tutor'
}


const OtpForm: React.FC <OtpFormProps> = ({values,role}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  

  const [otp, setOtp] = useState<string[]>(Array(4).fill(""));
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(true);

 

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerActive]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;

    setOtp(newOtp);

    if (e.target.value.length > 0 && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        (nextInput as HTMLInputElement).focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        (prevInput as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");
    const formData = {
      email : values.email,
      name: values.name,
      phone:values.phone,
      password:values.password,
      otp: otpValue,
      role:role as 'user'|'tutor'
    }
    // console.log("data:",formData)

    try {
      const otpVerification = await dispatch(verifyOtp(formData));

      if (otpVerification === false) {
          toast.error("Wrong OTP, try again!");
      }else if (otpVerification === true) {
        toast.success("OTP verification successful.");
        navigate("/login");
      }else {
        toast.error("Unexpected response from server. Please try again.");
      }
   } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Something went wrong. Please try again.");
   }
  };

  const resentOtp = async () => {
    toast.loading("Loading...");

    setTimeout(() => {
      toast.dismiss();
      toast.success("A new OTP has been sent.");
      setTimeLeft(60);
      setTimerActive(true);
    }, 1000);

    try {
      // await dispatch(resendOtp());
    } catch (error: any) {
      toast.error("Error resending OTP.");
    }
  };

  const goToHome = () => {
    navigate("/");
  };

  return (
    <>
    <Navbar/>
    <div className="h-screen bg-#dee1ea-900 text-wh">
     <Toaster position="top-center" richColors  />
    <div className="w-full h-screen flex">
      <Toaster position="top-center" richColors />

      <div className="relative w-1/2 h-full flex flex-col">
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <h1 className="text-4xl text-white font-bold my-4">
            Start your Learning Journey.
          </h1>
          <p className="text-xl text-white font-normal">
            Start for free and start interacting with thousands of courses.
          </p>
        </div>
        <img
          src="./src/assets/pexels-cottonbro-7097464.jpg"
          className="w-full h-full object-cover"
          alt="Learning Journey"
        />
      </div>

      <div className="w-1/2 h-full bg-[#f5f5f5] flex flex-col justify-center pl-40">
        <h1
          className="text-3xl text-green-500 font-bold mb-10 cursor-pointer"
          onClick={goToHome}
        >
          Natyashala
        </h1>

        <div className="w-full max-w-[450px]">
          <div className="w-full flex flex-col mb-8">
            <h3 className="text-2xl font-semibold mb-2">OTP Verification for {role === "user" ? "User" : "Tutor"}</h3>
            <p className="mb-0 text-lg">Please enter your OTP.</p>
          </div>

          <form className="w-full flex flex-col" onSubmit={handleSubmit}>
            <div className="flex space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  className="w-full text-black py-2 my-2 border-b bg-transparent border-black outline-none focus:outline-none text-center"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  maxLength={1}
                />
              ))}
            </div>

            <div className="w-full flex items-center justify-between mt-4">
              <div className="flex items-center">
                <p className="mr-2 text-base">Time left:</p>
                {timeLeft > 0
                  ? `00:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`
                  : "Time expired"}
              </div>

              <p
                className="text-sm font-medium cursor-pointer underline"
                onClick={resentOtp}
              >
                Resend OTP
              </p>
            </div>

            <div className="w-full flex flex-col my-6">
              <button
                type="submit"
                className="w-full text-white bg-[#060606] rounded-md p-4 text-center flex items-center justify-center"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
       </div>
    </div>
    </>
  );
};

export default OtpForm;


