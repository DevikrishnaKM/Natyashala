
import {
    BookOpen,
    Users,
    Award,
    ChevronRight,
    Play,
    CheckCircle,
  } from "lucide-react";
  const Features = () => (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Platform</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the features that make our platform the perfect choice for
            your learning journey.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
        
      
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Expert-Led Courses</h3>
            <p className="text-gray-600">Learn from industry experts with real-world experience and comprehensive curriculum.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Community Learning</h3>
            <p className="text-gray-600">Join a vibrant community of learners and engage in collaborative projects.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Award className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-3">Certified Learning</h3>
            <p className="text-gray-600">Earn recognized certificates upon completion of your courses.</p>
          </div>
        </div>
      </div>
    </div>
  );
  
  
  
  export default Features;
  