import React, { useEffect, useState } from 'react';

import userAxiosInstance from '../../config/axiosInstance.ts/userInstance';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Navbar from '../../components/common/UserCommon/NavBar';
import VideoPlayer from '../../components/User/VideoPlayer';
import PlayList from '../../components/User/PlayList';
import { Base_URL } from '@/credentials';

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
  price: string | number;
  profileUrl : string;
  tutorId : string;
}

interface Ivideo {
  _id: string;
  title: string;
  url: string;
  description: string;
}

interface Isection {
  description: string;
  _id: string;
  title: string;
  sectionTitle: string;
  videos: Ivideo[];
}

const CoursePlayer2 = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const {userInfo} = useSelector((state : RootState) => state.user)
  const userId = userInfo?.userId
  const [courseData, setCourseData] = useState<IcourseData | null>(null);
  const [activeVideo, setActiveVideo] = useState<Ivideo | null>(null);


  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const {data} = await userAxiosInstance.get(`${Base_URL}/auth/getCourse/${courseId}`);
        setCourseData(data);
        console.log(data);
        if (data.sections.length > 0 && data.sections[0].videos.length > 0) {
          setActiveVideo(data.sections[0].videos[0]); 
        }

       
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourseData();
  }, [courseId]);



  return (
    <>
    <Navbar />
    <div className="bg-[#f9f9f9] pl-[2%] pr-[2%] py-5 flex justify-between h-[100vh] pt-20">
      <div className="w-3/4">
    
        <VideoPlayer
         video={activeVideo} 
         tutorName={courseData?.tutorName}
         tutorId={courseData?.tutorId}
          tutorProfile = {courseData?.profileUrl}
          tags = {courseData?.tags}
          description = {courseData?.description}
          courseId = {courseId}
          userId = {userId}
        />
      </div>
      <PlayList
      sections = {courseData?.sections}
      setActiveVideo = {setActiveVideo}
      thumbnail = {courseData?.thumbnailUrl}
      courseId = {courseId}
      activeVideo={activeVideo}
      />
   
    </div>
    </>
  );
};

export default CoursePlayer2;