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
  const getResultStatus = (result, refRanges) => {
    if (!refRanges || refRanges.length === 0) return "normal";

    const firstRange = refRanges[0];
    const value = parseFloat(result.result_value);
    const low = parseFloat(firstRange.low);
    const high = parseFloat(firstRange.high);

    if (isNaN(value) || isNaN(low) || isNaN(high)) return "normal";

    if (value < low) return "low";
    if (value > high) return "high";
    return "normal";
  };

  // Back button component with animation
  const BackButton = ({ onClick }) => (
    <Button
      variant="outline"
      className="mb-5 pl-3 group flex items-center transition-all border-blue-100 hover:border-blue-200 hover:bg-blue-50"
      onClick={onClick}
    >
      <ArrowLeft className="mr-2 h-4 w-4 text-blue-500 group-hover:-translate-x-1 transition-transform" />
      <span className="font-medium text-gray-700">Back to Reports</span>
    </Button>
  );

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading lab report...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your test results
          </p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen">
        <BackButton onClick={() => router.back()} />

        <Card className="border border-red-100 shadow-sm overflow-hidden">
          <div className="bg-red-50 p-4 border-b border-red-100">
            <div className="mx-auto w-12 h-12 rounded-full bg-white flex items-center justify-center">
              <FileText className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-medium text-red-700 mb-2">
              Error Loading Report
            </h3>
            <p className="text-gray-600">{error}</p>
            <Button
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
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
      <BackButton onClick={() => router.push("/records")} />

      {report && (
        <>
          {/* Lab Report Header Card */}
          <Card className="mb-5 overflow-hidden border-0 shadow-md">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white text-xl font-bold">Lab Report</h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {report.Lab?.name || "Medical Laboratory"}
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5 text-white text-sm">
                  ID: {report.id}
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              {/* Report details */}
              <div className="p-4 space-y-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="bg-blue-50 p-1.5 rounded-full">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-gray-500">Report Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {formatDate(report.report_date)}
                    </p>
                  </div>
                </div>

                {report.reference_number && report.reference_number !== "-" && (
                  <div className="flex items-center">
                    <div className="bg-blue-50 p-1.5 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Reference Number</p>
                      <p className="text-sm font-medium text-gray-800">
                        {report.reference_number}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lab Information */}
              {report.Lab && (
                <div className="p-4 bg-white">
                  <div className="flex items-start">
                    <div className="bg-blue-50 p-1.5 rounded-full mt-0.5">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Laboratory</p>
                      <p className="text-sm font-medium text-gray-800">
                        {report.Lab.name}
                      </p>

                      {report.Lab.Address && (
                        <div className="mt-1 bg-gray-50 rounded-lg p-2 text-xs text-gray-600">
                          <div className="flex items-start">
                            <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div className="ml-1.5 leading-relaxed">
                              {report.Lab.Address.street}
                              <br />
                              {report.Lab.Address.city},{" "}
                              {report.Lab.Address.state}{" "}
                              {report.Lab.Address.zip_code}
                              {report.Lab.Address.country !== "-" && (
                                <div className="mt-0.5">
                                  {report.Lab.Address.country}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Patient Information Card */}
          {report.Patient && (
            <Card className="mb-5 overflow-hidden border-0 shadow-sm">
              <div className="bg-gray-50 p-4 border-b border-gray-100">
                <h3 className="text-gray-700 font-medium flex items-center">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Patient Information
                </h3>
              </div>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-sm font-medium text-gray-700">
                      {report.Patient.first_name} {report.Patient.last_name}
                    </span>
                  </div>

                  {report.Patient.gender && report.Patient.gender !== "-" && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Gender</span>
                      <span className="text-sm font-medium text-gray-700">
                        {report.Patient.gender}
                      </span>
                    </div>
                  )}

                  {report.Patient.primary_phone && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Phone</span>
                      <span className="text-sm font-medium text-gray-700">
                        {report.Patient.primary_phone}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Patient ID</span>
                    <span className="text-sm font-medium text-gray-700">
                      {report.Patient.id}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Test Results Card */}
          {report.TestResults && report.TestResults.length > 0 && (
            <Card className="mb-5 overflow-hidden border-0 shadow-md">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-4">
                <h3 className="text-white font-medium flex items-center">
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 00-1 1v1.323l-3.954 1.582a1 1 0 00-.646.934v4.286a1 1 0 00.648.937l3.952 1.566V18a1 1 0 002 0v-5.373l3.952-1.567a1 1 0 00.648-.936V6.839a1 1 0 00-.646-.934L11 4.323V3a1 1 0 00-1-1zM8.264 6.703L11 5.477V9.6a1 1 0 00.653.937l1.997.666L9 13.477v-4.062a1 1 0 00-.652-.936L7.3 7.925l.964-1.222z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Test Results
                </h3>
              </div>

              <div className="divide-y divide-gray-100">
                {report.TestResults.map((test, index) => {
                  const status = getResultStatus(test, test.RefRanges);
                  const statusColor = {
                    normal: "text-emerald-600 bg-emerald-50 border-emerald-100",
                    high: "text-amber-600 bg-amber-50 border-amber-100",
                    low: "text-blue-600 bg-blue-50 border-blue-100",
                  }[status];

                  return (
                    <div key={test.id || index} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {test.LabTest.name}
                          </h4>
                          {test.LabTest.alias &&
                            test.LabTest.alias !== "-" &&
                            test.LabTest.alias !== test.LabTest.name && (
                              <p className="text-xs text-gray-500">
                                {test.LabTest.alias}
                              </p>
                            )}
                        </div>

                        <div
                          className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}
                        >
                          {status === "normal"
                            ? "Normal"
                            : status === "high"
                            ? "High"
                            : "Low"}
                        </div>
                      </div>

                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 my-2">
                        <span className="text-sm text-gray-500">Result</span>
                        <span className="text-sm font-semibold">
                          {test.result_value} {test.units}
                        </span>
                      </div>

                      {test.RefRanges && test.RefRanges.length > 0 && (
                        <div className="mt-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Reference Range
                            </span>
                            <span className="text-xs font-medium text-gray-700">
                              {test.RefRanges[0].low} - {test.RefRanges[0].high}{" "}
                              {test.units}
                            </span>
                          </div>

                          {test.RefRanges[0].interpretation &&
                            test.RefRanges[0].interpretation !== "-" && (
                              <div className="bg-gray-50 p-2 rounded-md text-xs text-gray-600">
                                <span className="font-medium text-gray-700 block mb-0.5">
                                  Method:
                                </span>
                                {test.RefRanges[0].interpretation}
                              </div>
                            )}
                        </div>
                      )}

                      {/* Visual reference range indicator */}
                      {test.RefRanges &&
                        test.RefRanges.length > 0 &&
                        !isNaN(parseFloat(test.result_value)) && (
                          <div className="mt-3">
                            <div className="w-full h-2 bg-gray-200 rounded-full relative">
                              <div
                                className="absolute inset-y-0 bg-emerald-200 rounded-full"
                                style={{
                                  left: `${Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      (parseFloat(test.RefRanges[0].low) /
                                        parseFloat(test.RefRanges[0].high)) *
                                        100
                                    )
                                  )}%`,
                                  right: `${Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      100 -
                                        (parseFloat(test.RefRanges[0].high) /
                                          (parseFloat(test.RefRanges[0].high) *
                                            1.5)) *
                                          100
                                    )
                                  )}%`,
                                }}
                              ></div>
                              <div
                                className="absolute inset-y-0 w-2 bg-blue-500 rounded-full transform -translate-x-1/2"
                                style={{
                                  left: `${Math.max(
                                    0,
                                    Math.min(
                                      100,
                                      (parseFloat(test.result_value) /
                                        parseFloat(test.RefRanges[0].high)) *
                                        100
                                    )
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1 text-xs text-gray-400">
                              <span>{test.RefRanges[0].low}</span>
                              <span>{test.RefRanges[0].high}</span>
                            </div>
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Clinical Notes Card - Displayed only if they exist */}
          {report.clinical_notes && report.clinical_notes !== "-" && (
            <Card className="mb-5 overflow-hidden border-0 shadow-sm">
              <div className="bg-gray-50 p-4 border-b border-gray-100">
                <h3 className="text-gray-700 font-medium flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Clinical Notes
                </h3>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {report.clinical_notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Actions Card */}
          <div className="flex flex-col mt-8 space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl shadow-md"
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
                <span className="font-semibold">Print Report</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-300 py-6 rounded-xl"
              onClick={() => router.push(`/shared/labreport/${report.id}`)}
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
                  Share Report
                </span>
              </div>
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default LabReportDetail;
