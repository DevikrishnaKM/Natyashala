'use client'

import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function OtpPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', ''])
  const [error, setError] = useState<string>('')
  const inputRefs = useRef<HTMLInputElement[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp]
      newOtp[index] = value
      setOtp(newOtp)
      
      // Move to the next input if value is not empty and it's not the last input
      if (value && index < 3) {
        inputRefs.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (otp.some(value => value === '')) {
      setError('Please enter all 4 digits of the OTP')
      return
    }

    setError('')
    const otpCode = otp.join('')
    console.log('OTP entered:', otpCode)
    // Add OTP verification logic here
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Enter OTP
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex justify-between">
              {otp.map((_, index) => (
                <Input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={otp[index]}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el!)}
                  className="w-12 h-12 text-center text-lg"
                />
              ))}
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <Button type="submit" className="w-full">
                Verify OTP
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
