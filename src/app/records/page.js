"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  User,
  FileText,
  FileDigit,
  MapPin,
  Calendar,
  Phone,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import { format, isSameDay, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

// ============== Helper Functions ==============
const parseDate = (dateStr) => {
  try {
    return dateStr ? new Date(dateStr) : null;
  } catch (e) {
    console.error("Error parsing date:", e);
    return null;
  }
};

const isValidDate = (date) => {
  return (
    date &&
    date instanceof Date &&
    !isNaN(date) &&
    typeof date.toDateString === "function"
  );
};

const extractMedicationDetails = (notes) => {
  if (!notes || notes === "-") return [];

  const lines = notes.split("\n").filter((line) => line.trim());
  return lines.map((line) => {
    // Try to identify medication types based on common prefixes
    const type = line.toLowerCase().includes("tab")
      ? "tablet"
      : line.toLowerCase().includes("inj")
      ? "injection"
      : line.toLowerCase().includes("syp")
      ? "syrup"
      : line.toLowerCase().includes("adv")
      ? "advice"
      : "medication";

    return {
      type,
      text: line.trim(),
    };
  });
};

const getMedicationEmoji = (type) => {
  switch (type) {
    case "tablet":
      return "💊";
    case "injection":
      return "💉";
    case "syrup":
      return "🧪";
    case "advice":
      return "ℹ️";
    default:
      return "💊";
  }
};

// ============== UI Components ==============

// User Profile Component with enhanced details
const UserProfile = ({ userData }) => {
  if (!userData) return null;

  return (
    <Card className="mb-5 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
          <div className="flex items-center">
            <div className="bg-white p-3 rounded-full shadow-md">
              <User className="h-6 w-6 text-teal-600" />
            </div>
            <div className="ml-3 text-white">
              <h3 className="font-semibold text-lg">
                {userData.firstName} {userData.lastName}
              </h3>
              <div className="flex items-center text-teal-100 text-sm">
                <Phone className="h-3 w-3 mr-1" />
                {userData.phone || "No phone number"}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-white flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <div className="mr-4">
              <span className="text-gray-500">Patient ID:</span>{" "}
              {userData.id || "N/A"}
            </div>
            {userData.gender && userData.gender !== "-" && (
              <div>
                <span className="text-gray-500">Gender:</span> {userData.gender}
              </div>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs text-teal-700"
            onClick={() => (window.location.href = "/profile")}
          >
            View Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Tab Navigation Component
const RecordsTabs = ({
  selectedTab,
  setSelectedTab,
  prescriptionsCount,
  labReportsCount,
}) => {
  return (
    <Tabs
      defaultValue={selectedTab}
      className="mb-6"
      onValueChange={setSelectedTab}
    >
      <TabsList className="grid grid-cols-2 gap-4 p-1.5 bg-gray-100/80 backdrop-blur rounded-xl mb-4 shadow-sm">
        <TabsTrigger
          value="prescription"
          className={`rounded-lg py-3 px-4 transition-all duration-300 ${
            selectedTab === "prescription"
              ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-xl ring-2 ring-teal-200"
              : "bg-white/80 text-gray-700 hover:bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <ClipboardList
              className={`h-4 w-4 ${
                selectedTab === "prescription"
                  ? "text-teal-100"
                  : "text-teal-600"
              }`}
            />
            <span className="font-medium">Prescriptions</span>
            {prescriptionsCount > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedTab === "prescription"
                    ? "bg-white/20 text-white"
                    : "bg-teal-100 text-teal-700"
                }`}
              >
                {prescriptionsCount}
              </span>
            )}
          </div>
        </TabsTrigger>
        <TabsTrigger
          value="lab-report"
          className={`rounded-lg py-3 px-4 transition-all duration-300 ${
            selectedTab === "lab-report"
              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-xl ring-2 ring-blue-200"
              : "bg-white/80 text-gray-700 hover:bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center justify-center space-x-2">
            <FileDigit
              className={`h-4 w-4 ${
                selectedTab === "lab-report" ? "text-blue-100" : "text-blue-600"
              }`}
            />
            <span className="font-medium">Lab Reports</span>
            {labReportsCount > 0 && (
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedTab === "lab-report"
                    ? "bg-white/20 text-white"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {labReportsCount}
              </span>
            )}
          </div>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

// Loading Indicator Component
const LoadingIndicator = () => (
  <div className="flex flex-col justify-center items-center py-12">
    <Loader2 className="h-10 w-10 text-teal-600 animate-spin mb-4" />
    <p className="text-gray-600 font-medium">Loading records...</p>
    <p className="text-sm text-gray-500 mt-2">
      Please wait while we fetch your medical data
    </p>
  </div>
);

// Error Message Component
const ErrorMessage = ({ error }) => (
  <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-100">
    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <p className="text-red-500 mb-2 font-medium">{error}</p>
    <p className="text-gray-500 mb-4 text-sm">
      There was a problem loading your medical records
    </p>
    <Button
      onClick={() => (window.location.href = "/")}
      variant="outline"
      className="mt-2"
    >
      Go to Home
    </Button>
  </div>
);

// Empty State Component
const EmptyState = ({ type }) => (
  <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-center mb-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
        <FileText className="w-10 h-10 text-gray-400" />
      </div>
    </div>
    <h3 className="text-lg font-medium text-gray-800 mb-2">
      No {type === "prescription" ? "prescription records" : "lab reports"}{" "}
      found
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Upload your {type === "prescription" ? "prescriptions" : "lab reports"} to
      view them here
    </p>
    <Button
      onClick={() => (window.location.href = "/upload")}
      className="bg-teal-600 hover:bg-teal-700 text-white"
    >
      Upload {type === "prescription" ? "Prescription" : "Lab Report"}
    </Button>
  </div>
);

// Summary Component with visual indicators

// Enhanced Prescription Card Component
const PrescriptionCard = ({ prescription }) => {
  const prescriptionDate = parseDate(prescription.prescription_date);
  const medications = extractMedicationDetails(prescription.notes);
  const hasDetails = medications.length > 0;

  return (
    <Card className="mb-4 overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="bg-teal-50 p-2 rounded-md">
                <ClipboardList className="h-5 w-5 text-teal-600" />
              </div>
              <div className="ml-2">
                <div className="font-medium text-gray-800">
                  Prescription #{prescription.id}
                </div>
                {prescription.Doctor && prescription.Doctor.name !== "Dr." && (
                  <div className="text-xs text-gray-500">
                    Dr. {prescription.Doctor.name}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <div className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {isValidDate(prescriptionDate)
                  ? format(prescriptionDate, "dd MMM yyyy")
                  : "No date"}
                {isValidDate(prescriptionDate) &&
                  isSameDay(prescriptionDate, new Date()) &&
                  " (Today)"}
              </div>

              {prescription.Doctor &&
                prescription.Doctor.primary_phone &&
                prescription.Doctor.primary_phone !== "-" && (
                  <div className="text-xs text-gray-500 mt-1">
                    {prescription.Doctor.primary_phone}
                  </div>
                )}
            </div>
          </div>

          {/* Registration information if available */}
          {prescription.Doctor &&
            prescription.Doctor.registration_number &&
            prescription.Doctor.registration_number !== "-" && (
              <div className="mb-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                Registration: {prescription.Doctor.registration_number}
              </div>
            )}

          {/* Medications list with improved styling */}
          {hasDetails ? (
            <div className="mt-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Medications
              </h4>
              <div className="bg-gray-50 rounded-lg p-3">
                {medications.map((med, medIndex) => (
                  <div
                    key={medIndex}
                    className={`flex items-start ${
                      medIndex > 0 ? "mt-3 pt-3 border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="p-2 rounded-md mr-3 bg-white shadow-sm border border-gray-100">
                      <div className="w-6 h-6 flex items-center justify-center">
                        <span>{getMedicationEmoji(med.type)}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-700">{med.text}</div>
                      {med.type === "advice" && (
                        <div className="text-xs text-teal-600 mt-1">
                          Medical Advice
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg mt-3">
              No medication details available for this prescription
            </div>
          )}
        </div>
        <div className="bg-gray-50 p-3 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500">ID: {prescription.id}</div>
          <Button
            variant="ghost"
            className="text-sm text-teal-700 hover:text-teal-800 hover:bg-teal-50 flex items-center"
            onClick={() =>
              (window.location.href = `/prescription/${prescription.id}`)
            }
          >
            View Details <ArrowUpRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Lab Report Card Component
const LabReportCard = ({ report }) => {
  const reportDate = parseDate(report.report_date);
  const isRecent =
    isValidDate(reportDate) &&
    (new Date() - reportDate) / (1000 * 60 * 60 * 24) < 30;

  return (
    <Card className="mb-4 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 group">
      <CardContent className="p-0">
        {isRecent && (
          <div className="bg-blue-50 py-1 px-3 text-xs font-medium text-blue-700 flex items-center border-b border-blue-100">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></div>
            New Report
          </div>
        )}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-2.5 rounded-lg shadow-sm">
                <FileDigit className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors">
                  {report.Lab?.name || "Lab Report"}
                </div>
                {report.reference_number && report.reference_number !== "-" && (
                  <div className="text-xs text-gray-500 mt-0.5 flex items-center">
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 mr-1">
                      Ref:
                    </span>
                    {report.reference_number}
                  </div>
                )}
              </div>
            </div>

            <div className="text-xs bg-blue-50 px-2.5 py-1 rounded-full text-blue-700 flex items-center font-medium">
              <Calendar className="h-3 w-3 mr-1.5" />
              {isValidDate(reportDate)
                ? format(reportDate, "dd MMM yyyy")
                : "No date"}
            </div>
          </div>

          {/* Lab with better address formatting */}
          {report.Lab?.Address && (
            <div className="mb-3 mt-3 bg-gray-50 rounded-lg p-3">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                <div className="ml-2">
                  <div className="text-sm text-gray-700 font-medium">
                    {report.Lab.name}
                  </div>
                  <div className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {report.Lab.Address.street}
                    {report.Lab.Address.city && (
                      <>
                        <br />
                        {report.Lab.Address.city}
                        {report.Lab.Address.state !== "-" &&
                          `, ${report.Lab.Address.state}`}
                        {report.Lab.Address.zip_code !== "-" &&
                          ` - ${report.Lab.Address.zip_code}`}
                      </>
                    )}
                    {report.Lab.Address.country &&
                      report.Lab.Address.country !== "-" && (
                        <div className="mt-1">{report.Lab.Address.country}</div>
                      )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Clinical Notes with improved empty state */}
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
              Clinical Notes
            </h4>
            {report.clinical_notes && report.clinical_notes !== "-" ? (
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {report.clinical_notes}
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic bg-gray-50 p-3 rounded-lg border border-gray-100 text-center">
                No clinical notes available
              </div>
            )}
          </div>
        </div>
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 border-t border-gray-100 flex justify-between items-center">
          <div className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
            ID: {report.id}
          </div>
          <Button
            variant="ghost"
            className="text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 flex items-center font-medium"
            onClick={() => (window.location.href = `/labreport/${report.id}`)}
          >
            View Details <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Lab Reports List Component - Improved with filtering and sorting
const LabReportsList = ({ labReports }) => {
  const [sortOrder, setSortOrder] = useState("newest");

  if (labReports.length === 0) {
    return <EmptyState type="lab-report" />;
  }

  // Find most recent lab report date
  const mostRecent = labReports.reduce((latest, current) => {
    const currentDate = parseDate(current.report_date);
    const latestDate = parseDate(latest);

    if (!isValidDate(currentDate)) return latest;
    if (!isValidDate(latestDate)) return current.report_date;

    return currentDate > latestDate ? current.report_date : latest;
  }, null);

  // Sort reports based on selected order
  const sortedReports = [...labReports].sort((a, b) => {
    const dateA = parseDate(a.report_date) || new Date(0);
    const dateB = parseDate(b.report_date) || new Date(0);

    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div>
      {/* Sorting controls */}
      <div className="flex items-center justify-between mb-4 bg-white p-2 rounded-lg shadow-sm">
        <div className="text-sm text-gray-700 font-medium">
          {labReports.length} Reports
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSortOrder("newest")}
            className={`text-xs px-2 py-1 rounded ${
              sortOrder === "newest"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Newest First
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`text-xs px-2 py-1 rounded ${
              sortOrder === "oldest"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Oldest First
          </button>
        </div>
      </div>

      {/* Lab reports list with animation */}
      <div className="space-y-4">
        {sortedReports.map((report, index) => (
          <div
            key={report.id || index}
            className="animate-fadeIn"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <LabReportCard report={report} />
          </div>
        ))}
      </div>

      {/* Quick stats */}
      {labReports.length >= 2 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Lab Report Analytics
          </h4>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="text-xs text-gray-500">Latest Report</div>
              <div className="text-sm font-medium text-gray-800">
                {isValidDate(parseDate(sortedReports[0]?.report_date))
                  ? format(
                      parseDate(sortedReports[0].report_date),
                      "MMM d, yyyy"
                    )
                  : "Unknown date"}
              </div>
            </div>
            <div className="bg-white rounded-lg p-2 shadow-sm">
              <div className="text-xs text-gray-500">First Report</div>
              <div className="text-sm font-medium text-gray-800">
                {isValidDate(
                  parseDate(
                    sortedReports[sortedReports.length - 1]?.report_date
                  )
                )
                  ? format(
                      parseDate(
                        sortedReports[sortedReports.length - 1].report_date
                      ),
                      "MMM d, yyyy"
                    )
                  : "Unknown date"}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Prescriptions List Component
const PrescriptionsList = ({ prescriptions }) => {
  if (prescriptions.length === 0) {
    return <EmptyState type="prescription" />;
  }

  // Find most recent prescription date
  const mostRecent = prescriptions.reduce((latest, current) => {
    const currentDate = parseDate(current.prescription_date);
    const latestDate = parseDate(latest);

    if (!isValidDate(currentDate)) return latest;
    if (!isValidDate(latestDate)) return current.prescription_date;

    return currentDate > latestDate ? current.prescription_date : latest;
  }, null);

  return (
    <div>
      {prescriptions.map((prescription, index) => (
        <PrescriptionCard
          key={prescription.id || index}
          prescription={prescription}
        />
      ))}
    </div>
  );
};

// Main Component
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
      setIsLoading(true);
      setError(null);

      try {
        // Fetch prescriptions
        if (selectedTab === "prescription") {
          console.log("Fetching prescriptions data...");

          const timeoutId = setTimeout(() => {
            if (isLoading) {
              console.log("API request is taking too long...");
            }
          }, 5000);

          try {
            let prescriptionData;

            // Primary fetch approach using proxy API
            try {
              const res = await fetch("/api/proxy/prescription", {
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                },
              });

              if (!res.ok) {
                throw new Error(`API returned status ${res.status}`);
              }

              prescriptionData = await res.json();
            } catch (apiError) {
              console.error("Primary API fetch error:", apiError);
              console.log("Trying fallback fetch method...");

              // Fallback approach
              const response = await fetch(
                `/api/proxy/patient/prescriptions/`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                }
              );

              if (!response.ok) {
                throw new Error(
                  `Fallback fetch failed with status ${response.status}`
                );
              }

              prescriptionData = await response.json();
            }

            clearTimeout(timeoutId);

            console.log("Prescription data received:", prescriptionData);
            setPrescriptions(prescriptionData.Prescriptions || []);

            // Update user data from the prescription response
            setUserData({
              firstName: prescriptionData.first_name || "",
              lastName: prescriptionData.last_name || "",
              gender: prescriptionData.gender || "-",
              phone: prescriptionData.primary_phone || "",
              id: prescriptionData.id,
            });
          } catch (prescriptionError) {
            clearTimeout(timeoutId);
            console.error(
              "All prescription fetch methods failed:",
              prescriptionError
            );

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

          try {
            const res = await fetch("/api/proxy/labreports", {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            });

            if (!res.ok) {
              throw new Error(`API returned status ${res.status}`);
            }

            const labReportData = await res.json();
            console.log("Lab Report data received:", labReportData);
            setLabReports(labReportData.LabTestReports || []);

            // Update user data from the lab report response
            setUserData({
              firstName: labReportData.first_name || "",
              lastName: labReportData.last_name || "",
              gender: labReportData.gender || "-",
              phone: labReportData.primary_phone || "",
              id: labReportData.id,
            });
          } catch (labError) {
            console.error("Lab reports fetch error:", labError);
            setError(`Failed to fetch lab reports: ${labError.message}`);

            // You could add a fallback for lab reports similar to prescriptions if needed
          }
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

  // Render content based on state
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (error && !isLoading) {
      return <ErrorMessage error={error} />;
    }

    if (selectedTab === "prescription") {
      return <PrescriptionsList prescriptions={prescriptions} />;
    } else {
      return <LabReportsList labReports={labReports} />;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 pt-24 min-h-screen pb-32">
      <div className="px-4">
        <UserProfile userData={userData} />

        <RecordsTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          prescriptionsCount={prescriptions.length}
          labReportsCount={labReports.length}
        />

        {renderContent()}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          className="h-14 w-14 rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
          onClick={() => (window.location.href = "/upload")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default RecordsPage;
