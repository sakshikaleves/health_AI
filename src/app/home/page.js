"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [showCamera, setShowCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scanLineRef = useRef(null);
  const router = useRouter();
  const stream = useRef(null);

  // Handle camera access
  const startCamera = async () => {
    setShowCamera(true);
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream.current;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  // Stop camera stream when component unmounts
  const stopCamera = () => {
    if (stream.current) {
      stream.current.getTracks().forEach((track) => track.stop());
    }
    setShowCamera(false);
  };

  // Handle taking the photo
  const capturePhoto = () => {
    setIsScanning(true);

    // Start scanning animation
    setTimeout(() => {
      setIsScanning(false);
      setIsAnalyzing(true);

      // Simulate analysis time
      setTimeout(() => {
        router.push("/records");
      }, 2000);
    }, 3000);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="p-4 min-h-screen">
      {!showCamera ? (
        <>
          <h2 className="text-lg font-semibold">0 Records</h2>
          <div className="mt-4 flex flex-col items-center justify-center border rounded-xl bg-gray-200 p-6 h-[450px]">
            <div className="relative flex flex-col items-center">
              <div className="rounded-lg flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="avatar"
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              </div>
              <p className="mt-4 text-center text-gray-600">
                Add your reports or prescriptions with a tap!
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button
              className="w-full flex items-center gap-2 bg-[#00796B] hover:bg-[#00796c] text-white"
              onClick={startCamera}
            >
              <Camera size={18} /> Take Photo
            </Button>
          </div>
        </>
      ) : (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#00796B] text-white flex justify-between items-center">
            <h2 className="text-lg font-medium">
              Analyse the Prescription or Report
            </h2>
            <button onClick={stopCamera} className="p-1">
              <X size={24} />
            </button>
          </div>

          {/* Camera View */}
          <div className="relative flex-grow overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            ></video>

            {/* Scanning Effect Overlay */}
            {isScanning && (
              <div className="absolute inset-0 flex flex-col items-center">
                <div className="absolute inset-0 border-2 border-teal-400 rounded-lg"></div>
                <div
                  ref={scanLineRef}
                  className="w-full h-1 bg-teal-400 animate-scan"
                ></div>
                <div className="absolute bottom-4 left-0 right-0 text-center text-white font-medium">
                  Scanning document...
                </div>
              </div>
            )}

            {/* Analysis message */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center flex-col">
                <div className="w-16 h-16 border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-white font-medium">
                  Analyzing document...
                </p>
              </div>
            )}
          </div>

          {/* Camera Controls */}
          {!isScanning && !isAnalyzing && (
            <div className="p-4 bg-black flex justify-center">
              <button
                onClick={capturePhoto}
                className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
              >
                <div className="w-14 h-14 border-2 border-gray-900 rounded-full"></div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
