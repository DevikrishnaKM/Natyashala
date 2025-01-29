
// import blog from "../../assets/userbanner/";


const About = () => {
  return (
    <section className="relative flex h-screen items-center justify-center bg-black px-4 py-16">
      <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
       
        <div className="relative flex flex-col items-center justify-center gap-6">

          <div className="relative w-[500px] h-[300px] transition-transform duration-500 transform hover:scale-105 hover:translate-y-[-10px] z-10">
            <img
              src=""
              alt="E-Learning Illustration"
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
            <div className="absolute bottom-4 left-4 bg-white/75 backdrop-blur-sm px-3 py-2 rounded-md shadow-md">
              <p className="text-sm font-semibold text-[#17171a]">
                Explore Our Courses
              </p>
            </div>
          </div>
          

          
        </div>

      
        <div className="flex flex-col justify-center text-center md:text-left gap-8">
          <h1 className="text-4xl font-extrabold text-[#7BC74D] md:text-5xl">
            About Us
          </h1>
          <p className="text-lg text-gray-400 md:text-xl">
            Welcome to our e-learning platform, where education meets innovation.
            We provide a vast range of courses to help you learn at your own pace,
            anywhere and anytime. Our mission is to empower learners worldwide by
            providing accessible, engaging, and high-quality education.
          </p>
          <p className="text-md text-gray-400 md:text-lg">
            Our dedicated team of experts and educators work tirelessly to bring you
            the latest knowledge and best practices across various fields. Whether
            you're looking to advance your career, pick up a new skill, or simply
            explore your passions, we have something for everyone.
          </p>

         
         
        </div>
      </div>
    </section>
  );
};

export default About;