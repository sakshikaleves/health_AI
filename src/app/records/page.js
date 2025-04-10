"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2, User, FileText, FileDigit, MapPin } from "lucide-react";
import { format, isSameDay } from "date-fns";
import apiService from "@/services/api";
import { toast } from "sonner";

const RecordsPage = () => {
  const [selectedTab, setSelectedTab] = useState("prescription");

  // API data states
  const [prescriptions, setPrescriptions] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      if (!apiService.isAuthenticated()) {
        console.log("Not authenticated, redirecting to login");
        setError("User not authenticated. Please log in.");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch prescriptions
        if (selectedTab === "prescription") {
          console.log("Fetching prescriptions data...");
          console.log("Session ID:", apiService.sessionId); // Log session ID to verify auth

          // Add a timeout to handle cases where the API might be slow to respond
          const timeoutId = setTimeout(() => {
            if (isLoading) {
              console.log("API request is taking too long...");
            }
          }, 5000);

          try {
            // Try a direct fetch as a fallback if the API service fails
            let prescriptionData;
            try {
              prescriptionData = await apiService.getPrescriptions();
            } catch (apiError) {
              console.error("API service error:", apiError);
              console.log("Trying direct fetch as fallback...");
              
              // Direct fetch as fallback - Add trailing slash to match Postman collection
              const response = await fetch(`/api/proxy/patient/prescriptions/`, {
                headers: {
                  'Authorization': `Bearer ${apiService.sessionId}`,
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              });
              
              if (!response.ok) {
                throw new Error(`Fallback fetch failed with status ${response.status}`);
              }
              
              prescriptionData = await response.json();
            }

            clearTimeout(timeoutId);

            console.log("Prescription data received:", prescriptionData);
            setPrescriptions(prescriptionData.Prescriptions || []);
            setUserData({
              firstName: prescriptionData.first_name || "",
              lastName: prescriptionData.last_name || "",
              gender: prescriptionData.gender || "-",
              phone: prescriptionData.primary_phone || "",
              id: prescriptionData.id,
            });
          } catch (prescriptionError) {
            clearTimeout(timeoutId);
            console.error("Prescription fetch error:", prescriptionError);

            // Emergency fallback: Use dummy data
            console.log("Using emergency fallback data");
            setPrescriptions([
              {
                id: 1,
                prescription_date: new Date().toISOString(),
                Doctor: { name: "Sample Doctor" },
                notes:
                  "This is a sample prescription\nPlease connect to the server for real data",
              },
            ]);
            setError(
              `Error: ${prescriptionError.message}. Using sample data instead.`
            );
          }
        }
        // Fetch lab reports
        else if (selectedTab === "lab-report") {
          console.log("Fetching lab reports data...");
          const labReportData = await apiService.getLabReports();
          console.log("Lab Report data received:", labReportData);
          setLabReports(labReportData.LabTestReports || []);
          setUserData({
            firstName: labReportData.first_name || "",
            lastName: labReportData.last_name || "",
            gender: labReportData.gender || "-",
            phone: labReportData.primary_phone || "",
            id: labReportData.id,
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to fetch data: ${err.message || "Unknown error"}`);
        toast.error("Error loading records");

        // Handle authentication errors by redirecting to login
        if (err.message?.includes("not authenticated")) {
          window.location.href = "/";
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedTab]);

  // Parse date from API response
  const parseDate = (dateStr) => {
    try {
      return dateStr ? new Date(dateStr) : null;
    } catch (e) {
      console.error("Error parsing date:", e);
      return null;
    }
  };

  // Check if a date is valid
  const isValidDate = (date) => {
    return (
      date &&
      date instanceof Date &&
      !isNaN(date) &&
      typeof date.toDateString === "function"
    );
  };

  // Extract medication details from prescription notes
  const extractMedicationDetails = (notes) => {
    if (!notes || notes === "-") return [];

    const lines = notes.split("\n").filter((line) => line.trim());
    return lines.map((line) => {
      return {
        type: "pill",
        text: line.trim(),
      };
    });
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-1 text-gray-800">Records</h2>
      <p className="text-sm text-gray-500 mb-5">Based on uploaded records.</p>

      {/* User info if available */}
      {userData && (
        <div className="mb-4 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-teal-100 p-2 rounded-full">
              <User className="h-4 w-4 text-teal-600" />
            </div>
            <div className="ml-2">
              <p className="font-medium text-sm">
                {userData.firstName} {userData.lastName}
              </p>
              <p className="text-xs text-gray-500">{userData.phone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <Tabs
        defaultValue={selectedTab}
        className="mb-5"
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid grid-cols-2 gap-3 p-1 bg-gray-100 rounded-xl mb-4">
          <TabsTrigger
            value="prescription"
            className={`rounded-lg py-2.5 px-4 transition-all duration-200 ${
              selectedTab === "prescription"
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            }`}
          >
            Prescription
          </TabsTrigger>
          <TabsTrigger
            value="lab-report"
            className={`rounded-lg py-2.5 px-4 transition-all duration-200 ${
              selectedTab === "lab-report"
                ? "bg-teal-600 text-white shadow-sm"
                : "bg-transparent text-gray-600 hover:bg-gray-200"
            }`}
          >
            Lab Report
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-teal-600 animate-spin" />
          <p className="ml-2 text-gray-600">Loading records...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-100">
          <p className="text-red-500 mb-2">{error}</p>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="mt-4"
          >
            Go to Home
          </Button>
        </div>
      )}

      {/* Prescription Records */}
      {selectedTab === "prescription" && !isLoading && !error && (
        <div className="space-y-4">
          {prescriptions.length > 0 ? (
            <>
              {/* Simple summary */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-600 mb-3">
                  Summary
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-700">
                    {prescriptions.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total Prescriptions
                  </div>
                </div>
              </div>

              {/* Prescriptions list */}
              {prescriptions.map((prescription, index) => {
                const prescriptionDate = parseDate(
                  prescription.prescription_date
                );
                const medications = extractMedicationDetails(
                  prescription.notes
                );

                return (
                  <Card
                    key={prescription.id || index}
                    className="shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">
                            Prescription {prescription.id}
                          </div>
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                            {isValidDate(prescriptionDate)
                              ? format(prescriptionDate, "dd MMM yyyy")
                              : "No date"}
                            {isValidDate(prescriptionDate) &&
                              isSameDay(prescriptionDate, new Date()) &&
                              " (Today)"}
                          </div>
                        </div>

                        {/* Doctor information */}
                        {prescription.Doctor && (
                          <div className="mt-2 flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-1" />
                            <span>Dr. {prescription.Doctor.name}</span>
                          </div>
                        )}

                        {/* Medications list */}
                        <div className="mt-3 space-y-2.5"></div>
                          {medications.length > 0 ? (
                            medications.map((med, medIndex) => (
                              <div key={medIndex} className="flex items-center">
                                <div className="p-2 rounded-md mr-3 bg-gray-100">
                                  <div className="w-5 h-5 flex items-center justify-center">
                                    <span>💊</span>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-700">
                                  {med.text}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-gray-500 italic">
                              No medication details available
                            </div>
                          )}
                        </div>
                      <div className="bg-gray-50 p-2 text-right">
                        <Button
                          variant="ghost"
                          className="text-xs text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                          onClick={() =>
                            (window.location.href = `/prescription/${prescription.id}`)
                          }
                        >
                          View Details →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-600 mb-2">
                No prescription records available.
              </p>
              <p className="text-sm text-gray-500">
                Upload your prescriptions to view them here
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lab Reports */}
      {selectedTab === "lab-report" && !isLoading && !error && (
        <div className="space-y-4">
          {labReports.length > 0 ? (
            <>
              {/* Simple summary */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-sm font-medium text-gray-600 mb-3">
                  Summary
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-teal-700">
                    {labReports.length}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Total Lab Reports
                  </div>
                </div>
              </div>

              {/* Lab reports list */}
              {labReports.map((report, index) => {
                const reportDate = parseDate(report.report_date);

                return (
                  <Card
                    key={report.id || index}
                    className="shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-0">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="font-medium text-gray-800">
                            {report.Lab?.name || "Lab Report"}
                          </div>
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                            {isValidDate(reportDate)
                              ? format(reportDate, "dd MMM yyyy")
                              : "No date"}
                          </div>
                        </div>

                        {/* Report details */}
                        <div className="mt-3 space-y-2">
                          {report.reference_number &&
                            report.reference_number !== "-" && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FileDigit className="h-4 w-4 mr-1 text-gray-500" />
                                <span>Ref: {report.reference_number}</span>
                              </div>
                            )}

                          {report.Lab?.Address && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                              <span>
                                {report.Lab.Address.street},{" "}
                                {report.Lab.Address.city}
                                {report.Lab.Address.zip_code !== "-"
                                  ? ` - ${report.Lab.Address.zip_code}`
                                  : ""}
                              </span>
                            </div>
                          )}

                          {report.clinical_notes &&
                            report.clinical_notes !== "-" && (
                              <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                {report.clinical_notes}
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 text-right">
                        <Button
                          variant="ghost"
                          className="text-xs text-teal-700 hover:text-teal-800 hover:bg-teal-50"
                          onClick={() =>
                            (window.location.href = `/labreport/${report.id}`)
                          }
                        >
                          View Details →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </>
          ) : (
            <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <p className="text-gray-600 mb-2">No lab reports available.</p>
              <p className="text-sm text-gray-500">
                Upload your lab reports to view them here
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecordsPage;
