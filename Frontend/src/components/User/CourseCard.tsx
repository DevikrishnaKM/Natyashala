"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaRegClock, FaStar, FaHeart, FaRegHeart, FaCheckCircle } from "react-icons/fa"
import { useSelector } from "react-redux"
import type { RootState } from "../../redux/store"
import { toast } from "sonner"
import userAxiosInstance from "../../config/axiosInstance.ts/userInstance"

interface IcourseData {
  courseName: string
  thumbnail: string
  courseId?: string 
  price: string | number
  rating?: number
  students?: number
  duration?: string
  lessons?: number
}

const CourseCard: React.FC<IcourseData> = ({
  courseName,
  thumbnail,
  courseId,
  price,
  rating = 5,
  students = 300,
  duration = "10 Hour",
  lessons = 30,
}) => {
  const { userInfo } = useSelector((state: RootState) => state.user)
  const email = userInfo?.email
  const navigate = useNavigate()
  const [courseData, setCourseData] = useState<IcourseData | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseResponse, enrollmentResponse] = await Promise.all([
          userAxiosInstance.get(`/auth/getCourse/${courseId}`),
          email ? userAxiosInstance.get(`/auth/check-enrollment/${email}/${courseId}`) : Promise.resolve({ data: false })
        ])
        
        console.log("courseData:", courseResponse.data)
        setCourseData(courseResponse.data)
        setIsEnrolled(enrollmentResponse.data)
        // If course is enrolled, we don't need to check wishlist status
        if (!enrollmentResponse.data) {
          // You might want to add an API call here to check initial wishlist status
          // For now, we'll assume it's not wishlisted initially if not purchased
          setIsWishlisted(false)
        }
      } catch (error) {
        console.error("Error fetching course data:", error)
      }
    }
    fetchCourseData()
  }, [courseId, email])

  const averageRating = courseData?.ratings?.length
    ? (courseData.ratings.reduce((a, b) => a + (b.ratingValue || 0), 0) / courseData.ratings.length).toFixed(1)
    : 0

  const gotoCourseDetails = async () => {
    try {
      if (userInfo?.isVerified === true) {
        toast.error("You are blocked.")
        return navigate("/login")
      }
      if (isEnrolled) {
        navigate(`/coursePlayer/${courseId}`)
      } else {
        navigate(`/courseDetails/${courseId}`)
      }
    } catch (error: any) {
      console.error("Error checking enrollment:", error.response?.data?.message)
      toast.warning(error?.response?.data?.message)
    }
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!userInfo) {
        toast.error("Please login to manage wishlist")
        return
      }

      const response = await userAxiosInstance.post(`/auth/toggle-wishlist`, {
        email,
        courseId,
      })

      setIsWishlisted(response.data)
      toast.success(response.data ? "Added to wishlist" : "Removed from wishlist")
    } catch (error: any) {
      console.error("Error toggling wishlist:", error.response?.data?.message)
      toast.error(error?.response?.data?.message || "Error updating wishlist")
    }
  }

  return (
    <div className="w-full max-w-[280px] mx-auto bg-white rounded-xl shadow-sm hover:shadow-md transition-transform duration-500 transform hover:scale-105 hover:translate-y-[-10px]">
      <div className="flex flex-col h-full relative">
        {/* Wishlist Heart Icon - Only show if not enrolled */}
        {!isEnrolled && (
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 z-10 p-2 bg-opacity-70 rounded-full"
          >
            {isWishlisted ? (
              <FaHeart className="w-5 h-5 text-red-600" />
            ) : (
              <FaRegHeart className="w-5 h-5 text-green-500" />
            )}
          </button>
        )}

        {/* Purchased Indicator */}
        {isEnrolled && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            <FaCheckCircle className="w-3 h-3" />
            <span>Purchased</span>
          </div>
        )}

        {/* Thumbnail */}
        <div
          className="w-full aspect-video bg-center bg-no-repeat bg-cover rounded-t-xl cursor-pointer"
          style={{
            backgroundImage: `url(${thumbnail})`,
          }}
          onClick={gotoCourseDetails}
        />

        {/* Content Container */}
        <div className="flex flex-col p-3 flex-grow">
          <h3 className="text-[#111418] text-base font-normal leading-normal mb-2 line-clamp-2">{courseName}</h3>

          <div className="mt-auto">
            <div className="flex items-center justify-between w-full text-[#60758a]">
              <p className="text-sm font-medium">{price ? `₹${price}` : "Free"}</p>
              <div className="flex items-center gap-1">
                <FaRegClock className="w-3 h-3" />
                <span className="text-xs">{duration}</span>
              </div>
              <div className="flex items-center">
                <FaStar className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-600 ml-1">{averageRating}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(CourseCard)