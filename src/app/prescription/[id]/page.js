"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Clock,
  PenTool,
  Pill,
} from "lucide-react";
import { format, formatDate } from "date-fns";
import { toast } from "sonner";

const PrescriptionDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/proxy/prescription/${id}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch prescription (Status: ${response.status})`
          );
        }

        const data = await response.json();
        setPrescription(data);
      } catch (err) {
        console.error("Error fetching prescription:", err);
        setError(err.message || "Failed to load prescription");
        toast.error("Could not load prescription details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPrescription();
    }
  }, [id]);

  // Parse date from API response
  const parseDate = (dateStr) => {
    try {
      return dateStr ? new Date(dateStr) : null;
    } catch (e) {
      console.error("Error parsing date:", e);
      return null;
    }
  };

  const formatDate = (dateStr) => {
    const date = parseDate(dateStr);
    return date ? format(date, "MMMM dd, yyyy") : "No date available";
  };

  // Extract medication details from notes if available
  const extractMedicationDetails = (notes) => {
    if (!notes) return [];

    // This is a basic implementation - adapt based on your actual data format
    const lines = notes.split("\n").filter((line) => line.trim());
    const medications = [];

    let currentMed = {};

    for (let line of lines) {
      const trimmedLine = line.trim();

      // Look for typical medication patterns
      if (/^\d+\.|\-|\*/.test(trimmedLine) || /^[A-Z]/.test(trimmedLine)) {
        // If we already have a medication, save it before starting a new one
        if (currentMed.name) {
          medications.push(currentMed);
          currentMed = {};
        }
        currentMed.name = trimmedLine.replace(/^\d+\.|\-|\*/, "").trim();
      } else if (currentMed.name) {
        // Add to instructions if we're already processing a medication
        currentMed.instructions =
          (currentMed.instructions || "") + " " + trimmedLine;
      }
    }

    // Add the last medication if exists
    if (currentMed.name) {
      medications.push(currentMed);
    }

    return medications;
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto text-teal-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading prescription details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen">
        <Button
          variant="ghost"
          className="mb-4 pl-0 flex items-center text-gray-700"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="border border-red-100">
          <CardContent className="pt-6 text-center">
            <div className="rounded-full bg-red-50 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <FileText className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-red-700 mb-2">
              Error Loading Prescription
            </h3>
            <p className="text-gray-600">{error}</p>
            <Button
              className="mt-4 bg-teal-600 hover:bg-teal-700"
              onClick={() => router.push("/records")}
            >
              Return to Records
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract medications from notes if they exist
  const medications = prescription?.notes
    ? extractMedicationDetails(prescription.notes)
    : [];

  return (
    <div className="max-w-md mx-auto p-4 pb-16 bg-gray-50 min-h-screen">
      <BackButton onClick={() => router.push("/records")} />

      {prescription && (
        <>
          {/* Main prescription info */}
          <PrescriptionCard prescription={prescription} />

          {/* Drug & Food Interactions Section */}
          <DrugInteractionsCard
            interactionsHtml={prescription.PrescribedDrugInteractions}
          />

          {/* Notes or Empty State */}
          {prescription.notes && prescription.notes !== "-" ? (
            <Card className="mb-5 border-0 shadow-md overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                <h2 className="text-white text-lg font-semibold flex items-center">
                  <PenTool className="h-4 w-4 mr-2" />
                  Doctor&apos;s Notes
                </h2>
              </div>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-line">
                  {prescription.notes}
                </p>
              </CardContent>
            </Card>
          ) : (
            <EmptyNotes />
          )}

          {/* Additional Actions */}
          <div className="flex flex-col space-y-3 mt-8">
            <Button
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-6 rounded-xl shadow-md"
              onClick={() => window.print()}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Print Prescription</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-300 py-6 rounded-xl"
              onClick={() =>
                router.push(`/shared/prescription/${prescription.id}`)
              }
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-gray-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span className="font-semibold text-gray-700">
                  Share Prescription
                </span>
              </div>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PrescriptionDetail;

// PrescriptionCard - Main information card
const PrescriptionCard = ({ prescription }) => {
  return (
    <Card className="mb-5 overflow-hidden border-0 shadow-md">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-5">
        <h2 className="text-white text-xl font-bold flex items-center">
          <FileText className="h-5 w-5 mr-2" /> 
          Prescription #{prescription.id}
        </h2>
      
      </div>
      <CardContent className="p-0">
        {/* Doctor information */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-start">
            <div className="bg-teal-50 p-2 rounded-full">
              <User className="h-5 w-5 text-teal-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-800">Doctor Information</h3>
              <p className="text-sm text-gray-600 mt-1">{prescription.Doctor.name}</p>
              
              {prescription.Doctor.registration_number && prescription.Doctor.registration_number !== "-" && (
                <p className="text-xs text-gray-500 mt-1">
                  Reg: {prescription.Doctor.registration_number}
                </p>
              )}
              
              {prescription.Doctor.primary_phone && prescription.Doctor.primary_phone !== "-" && (
                <p className="text-xs text-gray-500 mt-1">
                  Phone: {prescription.Doctor.primary_phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Patient information */}
        <div className="p-4 bg-gray-50">
          <div className="flex items-start">
            <div className="bg-white p-2 rounded-full shadow-sm">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="font-medium text-gray-800">Patient</h3>
              <p className="text-sm text-gray-600 mt-1">
                {prescription.Patient.first_name} {prescription.Patient.last_name}
              </p>
              
              {prescription.Patient.primary_phone && prescription.Patient.primary_phone !== "-" && (
                <p className="text-xs text-gray-500 mt-1">
                  Phone: {prescription.Patient.primary_phone}
                </p>
              )}
              
              {prescription.Patient.gender && prescription.Patient.gender !== "-" && (
                <p className="text-xs text-gray-500 mt-1">
                  Gender: {prescription.Patient.gender}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// DrugInteractionsCard - Display drug and food interactions
const DrugInteractionsCard = ({ interactionsHtml }) => {
  if (!interactionsHtml || interactionsHtml === "-") return null;
  
  return (
    <Card className="mb-5 border-0 shadow-md overflow-hidden rounded-xl">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-4">
        <h2 className="text-white text-lg font-semibold flex items-center">
          <div className="bg-white p-1.5 rounded-full shadow-md mr-3 flex items-center justify-center">
            <Pill className="h-4 w-4 text-amber-600" />
          </div>
          Drug & Food Interactions
        </h2>
      </div>
      <CardContent className="p-0">
        <div className="bg-gradient-to-b from-amber-50 to-white">
          {interactionsHtml ? (
            <div 
              className="prose prose-sm max-w-none text-gray-700 p-5 prose-headings:font-medium prose-h3:text-base prose-h2:text-lg prose-li:my-1 prose-p:my-2 prose-strong:text-amber-700 prose-strong:font-medium"
              dangerouslySetInnerHTML={{ __html: interactionsHtml }}
            />
          ) : (
            <div className="p-5 text-center">
              <div className="bg-amber-100 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-3">
                <Pill className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-gray-600">No interaction information available</p>
            </div>
          )}
        </div>
        <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
          <div className="flex items-center text-xs text-amber-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Information about potential interactions between prescribed medications and food</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// EmptyNotes - Display when no notes are available
const EmptyNotes = () => (
  <Card className="mb-5 border-0 shadow-sm">
    <CardContent className="py-8">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <PenTool className="h-6 w-6 text-gray-400" />
        </div>
        <h3 className="text-gray-600 font-medium mb-1">No Notes Available</h3>
        <p className="text-sm text-gray-500">
          The doctor didn&apos;t provide additional notes for this prescription
        </p>
      </div>
    </CardContent>
  </Card>
);

// BackButton - Enhanced back button with animation
const BackButton = ({ onClick }) => (
  <Button
    variant="outline"
    className="mb-5 pl-3 flex items-center transition-all hover:translate-x-1 hover:bg-teal-50"
    onClick={onClick}
  >
    <ArrowLeft className="mr-2 h-4 w-4" />
    <span className="font-medium">Back to Records</span>
  </Button>
);

// Main component update
