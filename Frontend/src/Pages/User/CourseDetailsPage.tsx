

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { FaRegHeart, FaBook, FaStar } from "react-icons/fa"
import { HiMiniUsers } from "react-icons/hi2"
import { MdOndemandVideo } from "react-icons/md"
import Footer from "../../components/common/UserCommon/Footer";
 import BlockChecker from "../../services/BlockChecker";
 import userAxiosInstance from "../../config/axiosInstance.ts/userInstance";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordian"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import Navbar from "../../components/common/UserCommon/NavBar"

interface Ivideo {
  title: string
  videoUrl: string
}

interface Isection {
  title: string
  sectionTitle: string
  videos: Ivideo[]
}

interface IcourseData {
  name: string
  description: string
  Category: string
  sections: Isection[]
  tags: string[]
  language: string
  ratings: number[]
  comments: string[]
  thumbnailUrl: string
  tutorName: string
  tutorBio: string
  education: string
  certifications: string[]
  email: string
  courseId: string
  price: string | number
  users?: number
}

 const CourseDetailsPage = () => {
  BlockChecker()
  const { id } = useParams<{ id: string }>()
  const [courseData, setCourseData] = useState<IcourseData | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await userAxiosInstance.get(`/auth/getCourse/${id}`)
        console.log("courseData:",response.data)
        setCourseData(response.data)
      } catch (error) {
        console.error("Error fetching course data:", error)
      }
    }
    fetchCourseData()
  }, [id])

  const handleEnroll = () => {
    const userToken = localStorage.getItem('accessToken')
    if (!userToken) return navigate('/login')
    navigate(`/checkout/${courseData?.courseId}`)
  }

  const totalSections = courseData?.sections.length || 0
  const totalVideos = courseData?.sections.reduce(
    (total, section) => total + section.videos.length,
    0
  ) || 0


  
  
  const averageRating = courseData?.ratings.length
  ? (courseData.ratings.reduce((a, b) => a + (b.ratingValue || 0), 0) / courseData.ratings.length).toFixed(1)
  : "N/A";


  return (
    <>
      <Navbar />
    <div className="h-screen flex flex-col my-20">
    
      <main className="flex-grow bg-gray-50 ">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-4">{courseData?.name}</h1>
              <p className="text-gray-600 mb-6">{courseData?.description}</p>
              <div className="flex items-center space-x-4 mb-6">
                <Badge variant="secondary">
                  <FaStar className="mr-1" />
                  {averageRating}
                </Badge>
                <Badge variant="secondary">
                  <HiMiniUsers className="mr-1" />
                  {courseData?.users || 0} students
                </Badge>
                <Badge variant="secondary">
                  <FaBook className="mr-1" />
                  {totalVideos} lessons
                </Badge>
              </div>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {courseData?.sections.map((section, index) => (
                      <AccordionItem value={`section-${index}`} key={index}>
                        <AccordionTrigger>{section.title}</AccordionTrigger>
                        <AccordionContent>
                          {section.videos.map((video, videoIndex) => (
                            <div key={videoIndex} className="flex items-center space-x-2 py-2">
                              <MdOndemandVideo className="text-gray-500" />
                              <span>{video.title}</span>
                            </div>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>About the Instructor</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-avatar.jpg" alt={courseData?.tutorName} />
                      <AvatarFallback>{courseData?.tutorName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{courseData?.tutorName}</h3>
                      <p className="text-sm text-gray-500">{courseData?.education}</p>
                    </div>
                  </div>
                  <p className="text-gray-600">{courseData?.tutorBio}</p>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <img
                    src={courseData?.thumbnailUrl || "/placeholder.svg"}
                    alt={courseData?.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-4">
                    {courseData?.price ? `₹${courseData.price}` : "Free"}
                  </div>
                 
                  <Button variant="outline" className="w-full" onClick={handleEnroll}>
                    <FaRegHeart className="mr-2" /> Enroll Now
                  </Button>
                </CardContent>
                <CardFooter>
                  <div className="text-sm text-gray-500">
                    <p>{totalSections} sections</p>
                    <p>{totalVideos} videos</p>
                    <p>Language: {courseData?.language}</p>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
    </>
  )
}

export default CourseDetailsPage;