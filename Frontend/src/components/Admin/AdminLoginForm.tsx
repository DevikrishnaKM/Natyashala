import { useNavigate } from 'react-router-dom';
import React from 'react'
import { useState } from 'react';
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import * as Yup from 'yup'
import { adminLogin } from '../../redux/actions/adminActions';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'
import { toast,Toaster } from 'sonner'


export default function AdminLoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { error }: any = useSelector((state: RootState) => state.admin);

  const [showPassword, setShowPassword] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [generalError, setGeneralError] = React.useState('')

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Required'),
    password: Yup.string().required('Required'),
  })

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit:async (values,{setSubmitting}) => {
      setLoading(true)
      setGeneralError('')
      try {
        const resultAction= await dispatch(adminLogin(values))
        if(adminLogin.fulfilled.match(resultAction)){
          toast.success("Login successful");
          navigate("/admin/dashboard")
        }else if(error){
          if (error.message === 'Invalid email') {
            toast.error('Invalid email address');
          } else if (error.message === 'Invalid password') {
            toast.error('Incorrect password');
          } else {
            toast.error(error.message);
          }
        }
      } catch (error:any) {
        toast.error(error.message || 'An error occurred');
        setGeneralError(error.message || 'An error occurred');
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  })

  return (
    <>
    
    <div className="w-full h-screen flex">
      <Toaster position="top-center" richColors />
      <div className="relative w-1/2 h-full flex flex-col">
          <img
             src="./src/assets/pexels-cottonbro-7097464.jpg"
             className="w-full h-full object-fill"
             alt="Learning Journey"
            />
        <div className="absolute top-[20%] left-[10%] flex flex-col">
          <h1 className="text-4xl text-white font-bold my-4">Start your Learning Journey.</h1>
          <p className="text-xl text-white font-normal">
            Start for free and start interacting with thousands of courses.
          </p>
        </div>
      </div>

      <div className="w-1/2 h-full bg-[#f5f5f5] flex flex-col pl-32 pr-0 pt-32">
        <h1 className="text-3xl text-green-500 font-bold mb-5 cursor-pointer">Natyashala</h1>

        <div className="w-full max-w-[450px]">
          <div className="w-full flex flex-col mb-8">
            <h3 className="text-2xl font-semibold mb-2">Admin Login</h3>
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
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full text-black py-2 my-4 border-b bg-transparent border-black outline-none focus:outline-none"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                name="password"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye size={24} /> : <AiOutlineEyeInvisible size={24} />}
              </button>
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-sm">{formik.errors.password}</div>
              ) : null}
            </div>

            {generalError && <div className="text-red-500 text-sm">{generalError}</div>}

            <div className="w-full flex flex-col my-6">
              <button
                type="submit"
                className="w-full text-white bg-[#060606] rounded-md p-4 text-center flex items-center justify-center"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  )
  
}

