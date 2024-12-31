
import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-spotify-black text-white p-8 m-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="text-lg font-bold">Company</h5>
            <ul>
              <li><a href="#" className="hover:underline text-gray-400">About</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Careers</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Press</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Blog</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Affiliate Program</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Partnerships</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold">Community</h5>
            <ul>
              <li><a href="#" className="hover:underline text-gray-400">Team Plans</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Gift Membership Cards</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Corporate Gift Cards</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Scholarships</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold">Teaching</h5>
            <ul>
              <li><a href="#" className="hover:underline text-gray-400">Become a Teacher</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Teacher Help Center</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Teacher Rules & Requirements</a></li>
            </ul>
          </div>
          <div>
            <h5 className="text-lg font-bold">Mobile</h5>
            <ul>
              <li><a href="#" className="hover:underline text-gray-400">Download on the App Store</a></li>
              <li><a href="#" className="hover:underline text-gray-400">Get it on Google Play</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-gray-400 mt-8">
          &copy; Natyashala, Inc. 2024. All rights reserved.
        </div>
      </footer>
    );
}

export default Footer;
