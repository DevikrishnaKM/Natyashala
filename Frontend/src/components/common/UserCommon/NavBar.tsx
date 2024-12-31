import React, { useState,useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {decrypt} from "../../../utils/encryption";

interface NavItem {
  label: string
  href: string
}

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },

]

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const authStatus = decrypt(userInfo); // Decrypt the userInfo
      setLoggedIn(!!authStatus); // Set loggedIn to true if authStatus is valid
    } else {
      setLoggedIn(false); // No userInfo means user is not logged in
    }
  }, []);
  


  return (
    <nav className="bg-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0">
              <img className="h-8 w-8" src="./src/assets/output (1).jpg?height=32&width=32" alt="Logo" />
            </a>
            <h2 className="p-2 text-white text-lg">Natyashala</h2>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="text-white hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {loggedIn ? (
              <>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  <a href="/logout" className="w-full h-full flex items-center justify-center">
                    Log Out
                  </a>
                </Button>
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  <a href="/profile" className="w-full h-full flex items-center justify-center">
                    Profile
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-black"
                >
                  <a href="/login" className="w-full h-full flex items-center justify-center">
                    Sign In
                  </a>
                </Button>
                <Button className="w-full bg-white text-black hover:bg-gray-200">
                  <a href="/getStart" className="w-full h-full flex items-center justify-center">
                    Get Started
                  </a>
                </Button>
              </>
            )}
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>
  
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-white hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
              >
                {item.label}
              </a>
            ))}
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full text-white border-white hover:bg-white hover:text-black"
              >
                Sign In
              </Button>
              <Button className="w-full bg-white text-black hover:bg-gray-200">
                <a href="/getStart" className="w-full h-full flex items-center justify-center">
                  Get Started
                </a>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
  
}

export default Navbar

