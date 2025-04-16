"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Image from "next/image";

export default function PrescriptoWelcome() {
  const [currentPage, setCurrentPage] = useState(0);
  const router = useRouter();

  // Function to handle navigation
  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Define all pages
  const pages = [
    // Page 1: Welcome
    {
      render: () => (
        <>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-md flex items-center justify-center">
              <Image
                src="/logo.png"
                width={64}
                height={64}
                alt="Prescripto Logo"
              />
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Welcome to Prescripto!</h1>
            <p className="text-gray-600 text-sm mt-5">
              Your personalized health assistant <br />
              <span className="font-semibold text-teal-600">fast</span>,
              <span className="font-semibold text-teal-500"> simple</span>, and
              <span className="font-semibold text-teal-400"> intuitive</span>.
            </p>
            <ul className="text-left text-sm mt-12 space-y-2">
              {[
                "AI-Based Prescription & Lab Report Analysis",
                "Medication Conflict Detection",
                "Personalized Health Recommendations",
                "Family Sharing & Permissions",
              ].map((feature, index) => (
                <li key={index} className="flex items-center text-gray-700">
                  <span className="w-4 h-4 bg-teal-500 text-white flex items-center justify-center rounded-full mr-2">
                    <Check className="w-3 h-3" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          {/* No action button for first page */}
        </>
      ),
    },

    {
      render: () => (
        <>
          <div className="text-left flex flex-col h-[70%] justify-between ">
            <div>
              <h1 className="text-xl font-bold">For Guest Users</h1>
              <p className="text-gray-500 text-sm mt-1">
                Snap a Prescription, Get Instant Insights
              </p>

              <p className="text-left text-gray-700 text-sm mt-4">
                <span className="font-bold">No login required.</span> Just{" "}
                <span className="font-bold">take a picture</span> and let the
                app <span className="font-bold">analyze</span> your prescription
                for instant health insights.
              </p>
            </div>

            <div className="mt-8">
              <button
                className="w-full bg-teal-700 text-white py-3 rounded-md text-sm"
                onClick={() => router.push("/home")}
              >
                Continue as guest
              </button>
            </div>
          </div>
        </>
      ),
    },

    // Page 3: Registered Users (Exact UI as provided)
    {
      render: () => (
        <>
          <div className="text-left flex flex-col h-[70%] justify-between ">
            <div>
              <h1 className="text-xl font-bold">For Registered Users</h1>
              <p className="text-gray-500 text-sm mt-1">
                Snap a Prescription, Get Instant Insights & Track Your Health,
                Anytime, Anywhere
              </p>

              <p className="text-left text-gray-700 text-sm mt-4">
                Access your{" "}
                <span className="font-bold">full medical history</span>,{" "}
                <span className="font-bold">personalized recommendations</span>,
                and share your{" "}
                <span className="font-bold">health data securely</span> with{" "}
                <span className="font-bold">family members</span>.
              </p>
            </div>
            <div className="mt-8">
              <button
                className="w-full bg-teal-700 text-white py-3 rounded-md text-sm"
                onClick={() => router.push("/otp")}
              >
                Register
              </button>
            </div>
          </div>
        </>
      ),
    },
  ];

  return (
    <div className="flex items-center justify-center h-screen bg-white px-6">
      <div className="max-w-md h-full w-full relative">
        {/* Render the current page */}
        <div
        className="flex flex-col items-center justify-center h-full w-full"
        >{pages[currentPage].render()}</div>

        {/* Pagination - positioned at the bottom */}
        <div className=" absolute max-w-md left-0 right-0 bottom-5 flex items-center justify-between mt-6">
          <button
            className={`text-gray-500 p-2 ${
              currentPage === 0 ? "opacity-50" : ""
            }`}
            onClick={handlePrev}
            disabled={currentPage === 0}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <span
                key={index}
                className={`w-2 h-2 rounded-full cursor-pointer ${
                  currentPage === index ? "bg-black" : "bg-gray-300"
                }`}
                onClick={() => setCurrentPage(index)}
              ></span>
            ))}
          </div>

          <button
            className={`text-gray-500 p-2 ${
              currentPage === pages.length - 1 ? "opacity-50" : ""
            }`}
            onClick={handleNext}
            disabled={currentPage === pages.length - 1}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
