"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, FlaskConical, X, Upload, FileText, AlertTriangle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export default function Scanner() {
  const [showCamera, setShowCamera] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recordType, setRecordType] = useState(null); // 'prescription' or 'labrecord'
  const [uploadMethod, setUploadMethod] = useState(null); // 'camera' or 'device'
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);
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
      toast.error("Could not access camera. Please check permissions and try again.");
      setShowCamera(false);
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

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      await uploadFile(blob, `captured-image-${Date.now()}.jpg`);
    }, 'image/jpeg');

    // Start scanning animation
    setTimeout(() => {
      setIsScanning(false);
      setIsAnalyzing(true);
    }, 2000);
  };

  const uploadFile = async (file, fileName) => {
    setIsUploading(true);
    setIsAnalyzing(true);
    setUploadError(null);
    
    try {
      const formData = new FormData();
      
      if (recordType === 'prescription') {
        formData.append("file", file, fileName);
        await axios.post('/api/proxy/upload/prescription', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        formData.append("Labreport", file, fileName);
        await axios.post('/api/proxy/upload/labreport', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      // Show success
      setUploadSuccess(true);
      toast.success(`${recordType === 'prescription' ? 'Prescription' : 'Lab record'} uploaded successfully!`);
      
      // Redirect to records page after successful upload
      setTimeout(() => {
        router.push("/records");
      }, 1500);
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.error || "Failed to upload. Please try again.";
      setUploadError(errorMessage);
      toast.error(errorMessage);
      setIsAnalyzing(false);
      setIsUploading(false);
      setUploadSuccess(false);
      
      // If camera is open, reset view after error timeout
      setTimeout(() => {
        setUploadError(null);
        if (showCamera) {
          stopCamera();
          setRecordType(null);
          setUploadMethod(null);
        }
      }, 3000);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File is too large. Please select a file smaller than 10MB.");
        return;
      }
      await uploadFile(file, file.name);
    }
  };

  const handleDeviceUpload = () => {
    fileInputRef.current.click();
  };

  // Reset flow
  const resetFlow = () => {
    stopCamera();
    setRecordType(null);
    setUploadMethod(null);
    setIsAnalyzing(false);
    setIsUploading(false);
    setUploadError(null);
    setUploadSuccess(false);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (stream.current) {
        stream.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const renderInitialSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-teal-600 to-indigo-600 bg-clip-text text-transparent">Select Document Type</h2>
      
      <div className="grid grid-cols-1 gap-8 mb-8">
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-teal-200 transition-all duration-300 hover:shadow-teal-100/50"
          onClick={() => setRecordType('prescription')}
        >
          <div className="p-7 flex items-center space-x-5">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-4 rounded-xl shadow-md">
              <FileText size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Prescription</h3>
              <p className="text-gray-500">Upload your medical prescriptions for easy access</p>
            </div>
            <div className="bg-teal-50 p-3 rounded-full text-teal-600 transform transition-transform group-hover:translate-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-indigo-100/50"
          onClick={() => setRecordType('labrecord')}
        >
          <div className="p-7 flex items-center space-x-5">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-4 rounded-xl shadow-md">
              <FlaskConical size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Lab Record</h3>
              <p className="text-gray-500">Upload your medical test reports for tracking</p>
            </div>
            <div className="bg-indigo-50 p-3 rounded-full text-indigo-600 transform transition-transform group-hover:translate-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-auto"
      >
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-white rounded-full shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-600 font-medium">Your medical records are securely stored and accessible anytime</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderUploadMethodSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center mb-6">
        <button 
          onClick={() => setRecordType(null)} 
          className="mr-3 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          Upload {recordType === 'prescription' ? 'Prescription' : 'Lab Record'}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-48 flex flex-col items-center justify-center p-6"
          onClick={() => {
            setUploadMethod('camera');
            startCamera();
          }}
        >
          <div className="bg-teal-50 p-4 rounded-full mb-3">
            <Camera size={32} className="text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Take Photo</h3>
          <p className="text-sm text-gray-500 text-center mt-1">Use your camera to capture the document</p>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 h-48 flex flex-col items-center justify-center p-6"
          onClick={() => {
            setUploadMethod('device');
            handleDeviceUpload();
          }}
        >
          <div className="bg-indigo-50 p-4 rounded-full mb-3">
            <Upload size={32} className="text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Upload File</h3>
          <p className="text-sm text-gray-500 text-center mt-1">Choose a file from your device</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </motion.div>
      </div>
      
      <div className="bg-blue-50 rounded-xl p-4 mt-auto">
        <div className="flex items-start space-x-3">
          <div className="text-blue-500 mt-0.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium">For best results:</p>
            <p className="text-xs text-blue-600 mt-1">
              {recordType === 'prescription' 
                ? 'Ensure the prescription is well-lit and the text is clearly visible' 
                : 'Make sure all test values and information are clearly visible in the image'}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="max-w-lg mx-auto p-4 min-h-screen pt-10 flex flex-col bg-gray-50">
      {!recordType && renderInitialSelection()}
      {recordType && !showCamera && !isAnalyzing && renderUploadMethodSelection()}
      
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-teal-700 to-teal-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-medium">
                Capture {recordType === 'prescription' ? 'Prescription' : 'Lab Record'}
              </h2>
              <button 
                onClick={resetFlow} 
                className="p-2 rounded-full hover:bg-teal-800/50 transition-colors"
              >
                <X size={20} />
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

              {/* Scanning guides */}
              {!isScanning && !isAnalyzing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="absolute inset-12 border-2 border-white/50 rounded-lg border-dashed"></div>
                  <div className="absolute bottom-20 left-0 right-0 text-center text-white font-medium bg-black/30 py-2">
                    Position document within the frame
                  </div>
                </div>
              )}

              {/* Scanning Effect Overlay */}
              {isScanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center"
                >
                  <div className="absolute inset-12 border-2 border-teal-400 rounded-lg"></div>
                  <motion.div
                    initial={{ top: "10%" }}
                    animate={{ top: ["10%", "90%", "10%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute left-[10%] right-[10%] h-1 bg-teal-400"
                  ></motion.div>
                  <div className="absolute bottom-20 left-0 right-0 text-center text-white font-medium bg-black/40 py-3 backdrop-blur-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Scanning document...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Analysis message */}
              {isAnalyzing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center flex-col"
                >
                  {uploadSuccess ? (
                    <div className="text-center p-6 bg-black/50 rounded-xl backdrop-blur-md">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"
                      >
                        <CheckCircle2 size={40} className="text-green-500" />
                      </motion.div>
                      <p className="mt-4 text-white font-medium text-lg">Upload Successful!</p>
                      <p className="mt-2 text-gray-300 text-sm">Redirecting to your records...</p>
                    </div>
                  ) : uploadError ? (
                    <div className="text-center p-6 bg-black/50 rounded-xl backdrop-blur-md max-w-xs">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-16 h-16 mx-auto bg-red-500/20 rounded-full flex items-center justify-center"
                      >
                        <AlertTriangle size={40} className="text-red-500" />
                      </motion.div>
                      <p className="mt-4 text-white font-medium text-lg">Upload Failed</p>
                      <p className="mt-2 text-gray-300 text-sm">{uploadError}</p>
                    </div>
                  ) : (
                    <div className="text-center p-6 max-w-xs">
                      <div className="w-16 h-16 mx-auto border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <p className="mt-4 text-white font-medium text-lg">
                        {isUploading ? "Uploading..." : "Processing..."}
                      </p>
                      <p className="mt-2 text-gray-300 text-sm">
                        {isUploading 
                          ? "Securely uploading your document" 
                          : "Analyzing document content"}
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Camera Controls */}
            {!isScanning && !isAnalyzing && (
              <div className="p-6 bg-black flex justify-center items-center">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={capturePhoto}
                  className="w-18 h-18 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <div className="w-16 h-16 border-2 border-gray-900 rounded-full"></div>
                </motion.button>
              </div>
            )}
          </motion.div>
        )}
        
        {/* Fullscreen loading for file upload */}
        {!showCamera && isAnalyzing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center flex-col"
          >
            {uploadSuccess ? (
              <div className="text-center p-8 bg-black/50 rounded-xl backdrop-blur-md">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto bg-green-500/20 rounded-full flex items-center justify-center"
                >
                  <CheckCircle2 size={48} className="text-green-500" />
                </motion.div>
                <p className="mt-5 text-white font-medium text-xl">Upload Successful!</p>
                <p className="mt-2 text-gray-300">Redirecting to your records...</p>
              </div>
            ) : uploadError ? (
              <div className="text-center p-8 bg-black/50 rounded-xl backdrop-blur-md max-w-xs">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 mx-auto bg-red-500/20 rounded-full flex items-center justify-center"
                >
                  <AlertTriangle size={48} className="text-red-500" />
                </motion.div>
                <p className="mt-5 text-white font-medium text-xl">Upload Failed</p>
                <p className="mt-2 text-gray-300">{uploadError}</p>
                <button 
                  onClick={resetFlow}
                  className="mt-6 px-4 py-2 bg-white text-black rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="text-center p-8">
                <div className="w-20 h-20 mx-auto border-4 border-t-teal-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <p className="mt-5 text-white font-medium text-xl">
                  {isUploading ? "Uploading..." : "Processing..."}
                </p>
                <p className="mt-2 text-gray-300">
                  {isUploading 
                    ? "Securely uploading your document" 
                    : "Analyzing document content"}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
