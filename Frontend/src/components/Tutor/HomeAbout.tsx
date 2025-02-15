import React from 'react';

const HomeAbout = () => {
    return (
        <div className="min-h-screen bg-gray-100 grid grid-cols-12 gap-5 p-5 sm:p-10 lg:px-20 lg:py-10 font-poppins text-spotify-green">
            <h1 className='col-span-12 text-center mt-10 sm:mt-20 text-2xl sm:text-3xl font-bold text-green-700'>
                Start your Teaching Career
            </h1>

            <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-100'>
                <h3 className='font-bold pl-5 sm:pl-10 pb-3 text-lg sm:text-xl'>
                    Why Choose to Work with Us
                </h3>
                <p className='px-5 sm:px-5 font-medium mb-5 text-sm sm:text-lg text-green-700'>
                    "Join a platform that values your expertise and passion for teaching. We provide you with the tools, support, 
                    and resources you need to succeed in the online education space. Your success is our priority!"
                </p>
            </div>

            <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-100'>
                <h3 className='font-bold pl-5 sm:pl-10 pb-3 text-lg sm:text-xl'>
                    Benefits
                </h3>
                <p className='px-5 sm:px-5 font-medium mb-5 text-sm sm:text-lg text-green-700'>
                    "Experience the flexibility of teaching on your own terms. We offer competitive earnings,
                    continuous support, and a vibrant community of educators to collaborate with. 
                    Enjoy the freedom to shape your teaching journey."
                </p>
            </div>

            <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-100'>
                <h3 className='font-bold pl-5 sm:pl-10 pb-3 text-lg sm:text-xl'>
                    Build Your Career
                </h3>
                <p className='px-5 sm:px-5 font-medium mb-5 text-sm sm:text-lg text-green-700'>
                    "Elevate your career as an educator. With our platform, you can grow your personal brand,
                    reach a global audience, and continuously develop your skills through ongoing professional 
                    development opportunities."
                </p>
            </div>

            <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-100'>
                <h3 className='font-bold pl-5 sm:pl-10 pb-3 text-lg sm:text-xl'>
                    Build a Community
                </h3>
                <p className='px-5 sm:px-5 font-medium mb-5 text-sm sm:text-lg text-green-700'>
                    "Connect with like-minded educators and students. Our platform fosters a sense of community,
                    enabling you to engage with peers, share knowledge, and collaborate on innovative teaching methods."
                </p>
            </div>

            <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-100'>
                <h3 className='font-bold pl-5 sm:pl-10 pb-3 text-lg sm:text-xl'>
                    Earn Money
                </h3>
                <p className='px-5 sm:px-5 font-medium mb-5 text-sm sm:text-lg text-green-700'>
                    "Monetize your knowledge and expertise. Set your own rates, earn through course enrollments,
                    and enjoy a transparent payment system that ensures you get paid on time, every time."
                </p>
            </div>

            <div className='col-span-12 sm:col-span-6 lg:col-span-4 bg-gray-100'>
                <h3 className='font-bold pl-5 sm:pl-10 pb-3 text-lg sm:text-xl'>
                    Empowerment
                </h3>
                <p className='px-5 sm:px-5 font-medium mb-5 text-sm sm:text-lg text-green-700'>
                    "Empower yourself and your students. Our platform is designed to help you make a lasting impact,
                    providing you with the autonomy to create and deliver content that truly matters."
                </p>
            </div>
        </div>
    );
}

export default HomeAbout;