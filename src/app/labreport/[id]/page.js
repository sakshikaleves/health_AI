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
  MapPin,
  Calendar,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const LabReportDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLabReport = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/proxy/labreport/${id}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch report (Status: ${response.status})`
          );
        }

        const data = await response.json();
        setReport(data);
      } catch (err) {
        console.error("Error fetching lab report:", err);
        setError(err.message || "Failed to load lab report");
        toast.error("Could not load lab report details");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchLabReport();
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

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 mx-auto text-teal-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading lab report details...</p>
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
              Error Loading Report
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

      {report && (
        <>
          <Card className="mb-4 shadow-sm border border-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-bold text-gray-800">
                Lab Report
              </CardTitle>
              <CardDescription>
                {report.Lab?.name || "Laboratory Report"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    {formatDate(report.report_date)}
                  </span>
                </div>

                {report.reference_number && (
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-700">
                      Reference: {report.reference_number}
                    </span>
                  </div>
                )}

                {report.Lab && (
                  <div className="flex items-start">
                    <Building className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        {report.Lab.name}
                      </span>
                      {report.Lab.Address && (
                        <span className="text-xs text-gray-600 block">
                          {report.Lab.Address.street}, {report.Lab.Address.city}
                          , {report.Lab.Address.state}{" "}
                          {report.Lab.Address.zip_code !== "-"
                            ? report.Lab.Address.zip_code
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {report.Doctor && (
                  <div className="flex items-start">
                    <User className="h-4 w-4 mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-gray-700 block">
                        Dr. {report.Doctor.name}
                      </span>
                      {report.Doctor.specialty && (
                        <span className="text-xs text-gray-600">
                          {report.Doctor.specialty}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Clinical Notes */}
          {report.clinical_notes && report.clinical_notes !== "-" && (
            <Card className="mb-4 shadow-sm border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">
                  Clinical Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {report.clinical_notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Test Results */}
          {report.LabTestResults && report.LabTestResults.length > 0 && (
            <Card className="mb-4 shadow-sm border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-md font-medium">
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.LabTestResults.map((test, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="font-medium text-sm mb-1">
                        {test.test_name}
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Value:</span>
                        <span
                          className={`font-medium ${
                            test.is_abnormal
                              ? "text-orange-600"
                              : "text-gray-700"
                          }`}
                        >
                          {test.value} {test.unit}
                        </span>
                      </div>

                      {test.normal_range && test.normal_range !== "-" && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Normal Range:</span>
                          <span className="text-gray-700">
                            {test.normal_range}
                          </span>
                        </div>
                      )}

                      {test.comments && test.comments !== "-" && (
                        <div className="mt-1 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          {test.comments}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patient Information */}
          {report.Patient && (
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
                      {report.Patient.first_name} {report.Patient.last_name}
                    </span>
                  </div>

                  {report.Patient.gender && report.Patient.gender !== "-" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Gender:</span>
                      <span className="text-gray-700">
                        {report.Patient.gender}
                      </span>
                    </div>
                  )}

                  {report.Patient.date_of_birth && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="text-gray-700">
                        {formatDate(report.Patient.date_of_birth)}
                      </span>
                    </div>
                  )}

                  {report.Patient.primary_phone && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Phone:</span>
                      <span className="text-gray-700">
                        {report.Patient.primary_phone}
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

export default LabReportDetail;
