import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { toast, Toaster } from "sonner";
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/actions/UserActions";

export default function LoginPage() {
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().trim().email('Invalid email address').required('Email isRequired'),
      password: Yup.string().trim().min(8, "Password must be at least 8 characters").required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const loginResult = await dispatch(login(values)).unwrap();
        console.log("the result",loginResult)
        if (loginResult) {
          if (loginResult.userInfo?.isVerified===true) {
            toast.error(
              "Currently, you are restricted from accessing the site."
            );
            return;
          }
          toast.success("Login successful");
          if(loginResult.userInfo.role==="tutor"){
           navigate("/tutor");
          }else{
           navigate("/")
          }
        }
      } catch (err: any) {
        toast.error(err.message || "An error occurred");
      }
    },
  })

  const goToHome = () => {
   navigate("/")
  }

  return (
    <div className="w-full h-screen flex">
      <div className="relative w-1/3 h-full flex flex-col">
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

      <div className="w-1/2 h-full bg-[#f5f5f5] flex flex-col pl-64 pr-0 pt-8">
        <h1 className="text-3xl text-green-500 font-bold mb-5 cursor-pointer" onClick={goToHome}>
          Natyashala
        </h1>

        <div className="w-full max-w-[450px]">
          <div className="w-full flex flex-col mb-8">
            <h3 className="text-2xl font-semibold mb-2">Login</h3>
            <p className="text-base mb-4">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form className="w-full flex flex-col" onSubmit={formik.handleSubmit}>
            <input
              type="text"
              className="w-full text-black py-2 my-2 border-b bg-transparent border-black outline-none focus:outline-none"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="email"
              aria-label="Email"
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm" role="alert">{formik.errors.email}</div>
            ) : null}

            <input
              type="password"
              className="w-full text-black py-2 my-4 border-b bg-transparent border-black outline-none focus:outline-none"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              name="password"
              aria-label="Password"
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm" role="alert">
                {formik.errors.password}
              </div>
            ) : null}

            <div className="w-full flex items-center justify-between mt-4">
              <div className="flex items-center">
                
              </div>

              <button type="button" className="text-sm font-medium cursor-pointer underline">
                Forgot Password?
              </button>
            </div>

            <div className="w-full flex flex-col my-6">
              <button
                type="submit"
                className="w-full text-white bg-[#060606] rounded-md p-4 text-center flex items-center justify-center"
              >
                Log in
              </button>

            </div>
          </form>

          <div className="w-full flex items-center justify-center relative mb-6">
            <div className="w-full h-[1px] bg-black"></div>
            <p className="text-base absolute text-black/80 bg-[#f5f5f5] px-2">
              OR
            </p>
          </div>

          <div className="w-full flex items-center justify-center mt-4">
            <p className="text-sm font-normal text-black">
              Don't have an account?{" "}
              <Link
                to="/getStart"
                className="font-semibold underline underline-offset-2"
              >
                Sign Up for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

