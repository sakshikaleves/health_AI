'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';

export default function PhoneAuthentication() {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(5);

  // Countdown timer effect
  useEffect(() => {
    if (step === 'otp' && timer > 0) {
      const countdown = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(countdown);
    }
  }, [step, timer]);

  // Phone Number Handlers
  const handlePhoneNumberChange = (e) => {
    const cleaned = e.target.value.replace(/\D/g, '');
    const formatted = cleaned.slice(0, 10);
    setPhoneNumber(formatted);
  };

  const handleSendOTP = () => {
    if (phoneNumber.length === 10) {
      setStep('otp');
      setTimer(5);
    }
  };

  // OTP Handlers
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Automatically move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 6) {
      alert('Authentication Successful!');
      // Add your further authentication logic here
    }
  };

  const handleResendOTP = () => {
    setTimer(5);
    alert('New OTP sent!');
  };

  const handleGoBack = () => {
    if (step === 'otp') {
      setStep('phone');
      // Reset OTP
      setOtp(['', '', '', '', '', '']);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Back Button */}
      <button 
        onClick={handleGoBack} 
        className="absolute top-4 left-4 p-2"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>

      {/* Phone Number Entry */}
      {step === 'phone' && (
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <h1 className="text-2xl font-bold mb-6 text-center">Enter Mobile Number</h1>
          
          <div className="w-full max-w-md">
            <div className="flex items-center border rounded-lg overflow-hidden">
              {/* Country Code Dropdown */}
              <div className="flex items-center px-3 border-r bg-gray-100">
                <img 
                  src="/api/placeholder/24/16" 
                  alt="US Flag" 
                  className="w-6 h-4 mr-2"
                />
                <span>+1</span>
              </div>
              
              {/* Phone Number Input */}
              <input 
                type="tel"
                placeholder="555-123-4567"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="flex-1 p-3 outline-none"
                maxLength={10}
              />
            </div>

            {/* Send OTP Button */}
            <button 
              onClick={handleSendOTP}
              disabled={phoneNumber.length !== 10}
              className="w-full mt-4 p-3 bg-teal-600 text-white rounded-lg 
                         hover:bg-teal-700 transition-colors
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send OTP
            </button>
          </div>
        </div>
      )}

      {/* OTP Verification */}
      {step === 'otp' && (
        <div className="flex flex-col items-center justify-center flex-1 px-4">
          <h1 className="text-2xl font-bold mb-2 text-center">OTP Verification</h1>
          <p className="text-gray-600 mb-6 text-center">
            Enter the 6 digit OTP sent to +1 {phoneNumber}
          </p>

          {/* OTP Input Fields */}
          <div className="flex space-x-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-10 h-12 text-center border rounded-lg 
                           text-xl focus:outline-none focus:border-teal-500"
                pattern="\d*"
                inputMode="numeric"
              />
            ))}
          </div>

          {/* Resend OTP Section */}
          <div className="mb-4 text-center">
            {timer > 0 ? (
              <p className="text-gray-600">Expire in {timer}s</p>
            ) : (
              <button 
                onClick={handleResendOTP}
                className="text-teal-600 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          {/* Verify Button */}
          <button 
            onClick={handleVerifyOTP}
            disabled={otp.some(digit => digit === '')}
            className="w-full max-w-md p-3 bg-teal-600 text-white rounded-lg 
                       hover:bg-teal-700 transition-colors
                       disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Verify OTP
          </button>
        </div>
      )}
    </div>
  );
}