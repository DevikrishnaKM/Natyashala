import React from 'react';

const SelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Student Section */}
          <div className="flex-1 p-8 flex flex-col items-center">
            <div className="w-48 h-48 mb-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-4xl">👨‍🎓</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Student</h2>
            <p className="text-gray-600 mb-6 text-center">
              Join our platform as a student to find the perfect tutor for your needs.
            </p>
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300">
              <a href="/signup" className="block w-full h-full text-center">
                 Enroll as a Student
              </a>
            </button>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px bg-gray-200"></div>

          {/* Tutor Section */}
          <div className="flex-1 p-8 flex flex-col items-center">
            <div className="w-48 h-48 mb-6 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-4xl">👨‍🏫</span>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center">Tutor</h2>
            <p className="text-gray-600 mb-6 text-center">
              Sign up as a tutor to share your knowledge and help students succeed.
            </p>
            <button 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition duration-300"
              onClick={() => console.log('Navigate to tutor enrollment')}
            >
              Enroll as a Tutor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionPage;

