"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OnboardingScreen = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const screens = [
    {
      title: "Welcome to Prescipto!",
      subtitle:
        "Your personalized health assistant\nfast, simple, and intuitive.",
      features: [
        "AI-Based Prescription & Lab Report Analysis",
        "Medication Conflict Detection",
        "Personalized Health Recommendations",
        "Family Sharing & Permissions",
      ],
      buttonText: null,
      buttonAction: null,
    },
    {
      title: "For Guest Users",
      subtitle: "Snap a Prescription, Get Instant Insights",
      description:
        "No login required. Just take a picture and let\nthe app analyze your prescription for instant\nhealth insights.",
      buttonText: "Continue as guest",
      buttonAction: () => {},
    },
    {
      title: "For Registered Users",
      subtitle:
        "Snap a Prescription, Get Instant Insights & Track Your Health, Anytime, Anywhere",
      description:
        "Access your full medical history,\npersonalized recommendations, and\nshare your health data securely with\nfamily members.",
      buttonText: "Register",
      buttonAction: () => {},
    },
  ];

  const handleNext = () => {
    setCurrentScreen((prev) => (prev < screens.length - 1 ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentScreen((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const CurrentScreen = screens[currentScreen];

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex-grow flex flex-col justify-center items-center px-6 text-center">
        <div className="w-12 h-12 mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg
            className="w-8 h-8 text-teal-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {CurrentScreen.title}
        </h1>
        <p className="text-gray-600 mb-6 whitespace-pre-line">
          {CurrentScreen.subtitle}
        </p>

        {CurrentScreen.features && (
          <div className="space-y-2 mb-6">
            {CurrentScreen.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-teal-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {CurrentScreen.description && (
          <p className="text-gray-600 mb-6 whitespace-pre-line">
            {CurrentScreen.description}
          </p>
        )}

        {CurrentScreen.buttonText && (
          <button
            onClick={CurrentScreen.buttonAction}
            className="w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300"
          >
            {CurrentScreen.buttonText}
          </button>
        )}
      </div>

      <div className="flex justify-between items-center p-4">
        <button
          onClick={handlePrev}
          className={`p-2 ${
            currentScreen === 0
              ? "invisible"
              : "text-gray-600 hover:bg-gray-100 rounded-full"
          }`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="flex space-x-2">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentScreen ? "bg-teal-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className={`p-2 ${
            currentScreen === screens.length - 1
              ? "invisible"
              : "text-gray-600 hover:bg-gray-100 rounded-full"
          }`}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
