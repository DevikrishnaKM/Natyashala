import Navbar from '@/components/common/UserCommon/NavBar'
import HeroSection from "../../components/User/HeroSection"
import About from '@/components/User/About'
import PreLoader from '@/components/common/UserCommon/PreLoader'
import CoursesHome from '@/components/User/CoursesHome'
import Features from '@/components/User/Features'
import Footer from '@/components/common/UserCommon/Footer'

const Home = () => {
    return(
      <>
      <PreLoader/>
    <div>
    <Navbar />
    <main className="overflow-y-hidden  antialiased relative">
    <HeroSection />
    <About/>
    <CoursesHome/>
    <Features/>
    <Footer/>
    </main>
  </div>
  </>
    )
}

export default Home
