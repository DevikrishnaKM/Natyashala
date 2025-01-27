import  { useEffect, useState } from "react";
import { Toaster } from "sonner";
import Navbar from "@/components/common/UserCommon/NavBar";
import Footer from "@/components/common/UserCommon/Footer";
import BlockChecker from "@/services/BlockChecker";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useNavigate, useParams } from "react-router-dom";
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import { toast } from "sonner";
// import triggerConfetti from "../../utils/confetti";
import { Base_URL } from "@/credentials";

interface IcourseData {
  name: string;
  description: string;
  Category: string;
  sections: Isection[];
  tags: string[];
  language: string;
  ratings: number[];
  comments: string[];
  thumbnailUrl: string;
  tutorName: string;
  tutorBio: string;
  education: string;
  certifications: string[];
  email: string;
  courseId: string;
  price: any;
  users?: string[];
}

interface Ivideo {
  title: string;
  videoUrl: string;
}

interface Isection {
  title: string;
  sectionTitle: string;
  videos: Ivideo[];
}

export default function CheckoutPage() {
  BlockChecker();
  const { userInfo } = useSelector((state: RootState) => state.user);
  const email = userInfo?.email;
  const { id } = useParams<{ id: string }>();
  const [courseData, setCourseData] = useState<IcourseData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
     
      try {
        const response = await userAxiosInstance.get(`/auth/getCourse/${id}`);
        console.log("res:", response);
        setCourseData(response.data);
      } catch (error: any) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseData();
  }, [id]);

  const handlePayment = async () => {
    try {
      const responses = await userAxiosInstance.post(
        `${Base_URL}/auth/createorder`,
        {
          amount: courseData?.price,
          courseName: courseData?.name,
          email: email,
          courseId: courseData?.courseId,
        }
      );
      console.log("session", responses.data.message);

      if (responses.data.session) {
        window.location.href = responses.data.session.url;
      }

      // toast.success("Payment successful!");
      // triggerConfetti();
      // navigate("/allcourses");
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
      } else {
        console.error("Unexpected error:", error.message);
        alert("An unexpected error occurred.");
      }
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <Navbar />
      <div className="max-h-max bg-[#f5f5f5] pt-16">
        <div className="w-full h-screen flex">
          <div className="relative w-4/12 h-full flex flex-col">
            <div className="absolute top-[20%] left-[10%] flex flex-col">
              <h1 className="text-4xl text-green-500 font-bold my-4">
                Order Summary
              </h1>
              <p className="text-xl text-white font-normal">
                Review the items in your cart and complete your purchase.
              </p>
            </div>
            <img
              src="https://img.freepik.com/free-photo/long-hair-artist-holding-hands-air-stage_23-2148751615.jpg?ga=GA1.1.1173097961.1737443834&semt=ais_incoming"
              className="w-full h-full object-cover"
              alt="cover img"
            />
          </div>

          <div className="w-3/4 h-full bg-[#f5f5f5] flex flex-col pl-40 pr-0 pt-2">
            <div className="w-full max-w-[650px]">
              <div className="w-full flex flex-col mb-8">
                <h3 className="text-2xl font-semibold mb-2 pt-2">Checkout</h3>
                <p className="text-base mb-4">
                  Review your order and make your payment to complete the
                  purchase.
                </p>
              </div>

              <div className="flex justify-between items-start py-3 border-b">
                <div className="flex">
                  <img
                    src={courseData?.thumbnailUrl || "/fallback-thumbnail.jpg"}
                    alt="Course Thumbnail"
                    className="w-3/4 h-44 object-cover rounded-md"
                  />
                  <div className="ml-4 w-full">
                    <h2 className="text-lg font-bold">{courseData?.name}</h2>
                    <div className="text-gray-600 text-sm mt-1 w-full">
                      <p className="cursor-pointer mb-1">
                        {courseData?.Category}
                      </p>
                      <p>{courseData?.description}</p>
                      <p className="cursor-pointer mt-1">Sustainability</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <button className="text-green-500 font-semibold">
                    Price
                  </button>
                  <p className="font-bold">
                    ₹{courseData?.price ? courseData?.price : "Free"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">SUBTOTAL :</span>
                  <span className="font-bold">₹{courseData?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">EXTRA CHARGES :</span>
                  <span className="font-bold">₹0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-800 font-semibold">TOTAL :</span>
                  <span className="font-bold">₹{courseData?.price}</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center gap-5">
                {/* <button
                    className="bg-green-500 text-white px-6 py-2 rounded-full font-semibold"
                    
                  >
                    Pay now
                  </button> */}

                <button
                  type="submit"
                  className="w-3/4 text-white bg-[#060606] rounded-md p-4 text-center flex items-center justify-center gap-5 font-semibold"
                  onClick={handlePayment}
                >
                  Pay Now
                </button>
                <span className="text-green-500 pl-10">
                  Get Daily Cash With Nespola Card
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
