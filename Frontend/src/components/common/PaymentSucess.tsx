import { useEffect } from "react";

import { useParams, useNavigate, Link } from "react-router-dom";
import userAxiosInstance from "@/config/axiosInstance.ts/userInstance";
import triggerConfetti from "@/utils/confetti";
import { toast } from "sonner";

const PaymentSucess = () => {
  const { orderId, courseId } = useParams();
  const navigate = useNavigate();
  triggerConfetti();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      let course;
      try {
        const Response = await userAxiosInstance.get(
          `/auth/getCourse/${courseId}`
        );
        console.log(Response);
        course = Response.data.response;

        const response = await userAxiosInstance.post(
          "/auth/checkSessionStatus",
          {
              orderId: orderId,
          }
        );

        console.log("Payment status:", response.data);
      } catch (error: any) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          console.error(
            "Error in Stripe Checkout process:",
            error.response.data.message
          );

          toast.error(`${error.response.data.message}`);

          navigate(`/allCourses`, {
            state: { course },
        });
        } else {
          console.error("Unexpected error:", error.message);
          toast.error("An unexpected error occurred.");
        }
      }
    };

    checkPaymentStatus();
  }, [orderId, courseId, navigate]);

  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center p-4">
      <div className="bg-white p-6 md:w-1/3 rounded-2xl mx-auto">
        <svg
          viewBox="0 0 24 24"
          className="text-green-600 w-16 h-16 mx-auto my-6"
        >
          <path
            fill="currentColor"
            d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
          ></path>
        </svg>
        <div className="text-center">
          <h3 className="md:text-2xl text-lg text-gray-900 font-semibold">
            Payment Done!
          </h3>
          <p className="text-gray-600 my-2">
            Thank you for completing your secure online payment.
          </p>
          <p>Have a great day!</p>
          <div className="py-10 text-center">
            <Link
              to="/"
              className="px-6 md:px-12 bg-cyan-950 hover:bg-cyan-800 hover:text-white text-white font-semibold py-3 transition duration-300"
            >
              GO BACK
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSucess;
