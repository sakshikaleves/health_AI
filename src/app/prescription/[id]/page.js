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
import { format } from "date-fns";
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
    <div className="max-w-md mx-auto p-4 pb-16 bg-slate-50 min-h-screen">
      <Button
        variant="ghost"
        className="mb-4 pl-0 flex items-center text-gray-700"
        onClick={() => router.push("/records")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Records
      </Button>

      {prescription && (
        <>
          <Card className="mb-4 shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">
                Prescription
              </CardTitle>
              <CardDescription>
                {prescription.reference_number &&
                  `#${prescription.reference_number}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {formatDate(prescription.prescription_date)}
                  </span>
                </div>

                {prescription.Doctor && (
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Dr. {prescription.Doctor.name}
                      </span>
                      {prescription.Doctor.specialty && (
                        <span className="text-xs text-gray-600">
                          {prescription.Doctor.specialty}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {prescription.follow_up_date && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Follow-up: {formatDate(prescription.follow_up_date)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Medications */}
          {medications.length > 0 && (
            <Card className="mb-4 shadow-sm border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medications.map((medication, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start">
                        <Pill className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                        <div>
                          <div className="font-medium text-sm">
                            {medication.name}
                          </div>
                          {medication.instructions && (
                            <div className="text-xs text-gray-600 mt-1">
                              {medication.instructions}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {prescription.notes && (
            <Card className="mb-4 shadow-sm border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">
                  Doctor's Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start">
                  <PenTool className="h-4 w-4 mr-2 text-gray-500 mt-1" />
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {prescription.notes}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patient Information */}
          {prescription.Patient && (
            <Card className="shadow-sm border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">
                  Patient Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Name:</span>
                    <span className="text-gray-700">
                      {prescription.Patient.first_name}{" "}
                      {prescription.Patient.last_name}
                    </span>
                  </div>

                  {prescription.Patient.gender && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gender:</span>
                      <span className="text-gray-700">
                        {prescription.Patient.gender}
                      </span>
                    </div>
                  )}

                  {prescription.Patient.date_of_birth && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="text-gray-700">
                        {formatDate(prescription.Patient.date_of_birth)}
                      </span>
                    </div>
                  )}

                  {prescription.Patient.primary_phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-700">
                        {prescription.Patient.primary_phone}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default PrescriptionDetail;
