// import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useFormik} from "formik"
import { useNavigate,useLocation} from "react-router-dom"
import { toast } from "sonner"
import * as Yup from "yup"
import { AppDispatch } from "../../redux/store";
import {useDispatch} from "react-redux"
import { registerUser } from "../../redux/actions/UserActions"


const SignUpForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const role = queryParams.get('role');

  const formik = useFormik({
   initialValues: {
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmpassword: "",
   },
   validationSchema: Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    phone: Yup.string().transform((value) => value.trim()).matches(/^[0-9]{10}$/, "Phone number must be 10 digits").required("Phone number is required"),
    password: Yup.string().transform((value) => value.trim()).min(8, "Password must be at least 8 characters").required("Password is required"),
    confirmpassword: Yup.string().transform((value) => value.trim()).oneOf([Yup.ref("password"), ""], "Passwords must match").required("Confirm password is required"),
   }),
   onSubmit: async (values) => {
    try {
      const registrationResult = await dispatch(registerUser(values, role)); // Dispatching directly
      if (registrationResult) {
        navigate("/otp");
      } else {
        toast.error("Email already in use. Please use a different email.");
      }
    } catch (error) {
      toast.error("An error occurred during registration. Please try again later.");
    }
 }
   
  })

  return (
    <>
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
       <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Signup as a {role==="user"?"User":"Tutor"}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1"
              />
              {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-sm">
                {formik.errors.name}
              </div>
            ) : null}
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1"
              />
              {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-sm">
                {formik.errors.email}
              </div>
              ) : null}
            </div>

            <div>
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1"
              />
              {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-500 text-sm">
                {formik.errors.phone}
              </div>
               ) : null}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1"
              />
              {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
              ) : null}
            </div>

            <div>
              <Label htmlFor="confirmpassword">Confirm Password</Label>
              <Input
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                autoComplete="new-password"
                required
                value={formik.values.confirmpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="mt-1"
              />
              {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
              <div className="text-red-500 text-sm">
                {formik.errors.confirmpassword}
              </div>
              ) : null}
            </div>

            <div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => navigate('/login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Log in to your account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    </>
    
  )

}

export default SignUpForm
