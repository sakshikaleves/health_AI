"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  ArrowLeft,
  FileText,
  Building,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Heart,
  Activity,
  Pill,
  Info,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const LabReportDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(0); // First category expanded by default
  const [flippedCategories, setFlippedCategories] = useState({});
  const [flippedTests, setFlippedTests] = useState({});

  // Add styles for card flipping to the document
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = `
      .card-container {
        perspective: 1000px;
      }
      .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        transition: transform 0.6s;
        transform-style: preserve-3d;
      }
      .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      .card-back {
        transform: rotateY(180deg);
      }
      .flipped {
        transform: rotateY(180deg);
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  useEffect(() => {
    const fetchLabReport = async () => {
      setIsLoading(true);
      try {
        // Use the direct endpoint with byTestGroup parameter
        console.log(`Fetching lab report for ID: ${id}`);
        const apiUrl = `/api/proxy/labreport/${id}?byTestGroup=True`;
        console.log(`Using API URL: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`API response not OK: ${response.status}`, errorText);
          throw new Error(
            `Failed to fetch report (Status: ${response.status}): ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Lab report data received:", data);

        // Log the structure of TestResultsByHealthGroup
        if (data.TestResultsByHealthGroup) {
          console.log(
            "Number of health groups:",
            data.TestResultsByHealthGroup.length
          );
          console.log(
            "First health group structure:",
            JSON.stringify(data.TestResultsByHealthGroup[0], null, 2)
          );
        } else {
          console.error("TestResultsByHealthGroup is missing or null");
        }

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

  // Toggle category expansion
  const toggleCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? -1 : index);
  };

  // Toggle category card flip
  const toggleCategoryFlip = (index, e) => {
    e.stopPropagation(); // Prevent expanding/collapsing when flipping
    setFlippedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Toggle test card flip
  const toggleTestFlip = (testId, e) => {
    e.stopPropagation(); // Prevent event bubbling
    setFlippedTests((prev) => ({
      ...prev,
      [testId]: !prev[testId],
    }));
  };

  // Get color based on health score
  const getHealthScoreColor = (score) => {
    if (score >= 8) return "from-green-500 to-green-600";
    if (score >= 6) return "from-yellow-500 to-yellow-600";
    if (score >= 4) return "from-orange-500 to-orange-600";
    return "from-red-500 to-red-600";
  };

  // Get color based on test result status
  const getResultStatusColor = (value, refRanges) => {
    if (!refRanges || refRanges.length === 0) return "text-gray-700";

    const numValue = parseFloat(value);
    const low = parseFloat(refRanges[0].low);
    const high = parseFloat(refRanges[0].high);

    if (isNaN(numValue) || isNaN(low) || isNaN(high)) return "text-gray-700";

    if (numValue < low) return "text-blue-600";
    if (numValue > high) return "text-red-600";
    return "text-green-600";
  };

  // Get icon for health category
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("heart") || name.includes("cardio"))
      return <Heart className="h-5 w-5" />;
    if (name.includes("kidney")) return <Activity className="h-5 w-5" />;
    if (name.includes("liver")) return <Activity className="h-5 w-5" />;
    if (name.includes("blood")) return <Activity className="h-5 w-5" />;
    return <Activity className="h-5 w-5" />;
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">
            Loading lab report...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your health data
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
  console.log(report.TestResultsByHealthGroup);
  const TestResult = report.TestResultsByHealthGroup;
  return (
    <div className="max-w-md mx-auto p-4 pb-16 pt-20 bg-slate-50 min-h-screen">
      <BackButton onClick={() => router.push("/records")} />

      {report && (
        <>
          {/* Lab Report Header Card */}
          <Card className="mb-5 overflow-hidden border border-gray-200 shadow-md">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white text-lg font-bold">
                    Health Report
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {report.Lab?.name || "Medical Laboratory"}
                  </p>
                </div>
              </div>
            </div>

            {/* Add report date */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="flex items-center">
                <div className="bg-blue-50 p-1.5 rounded-md">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Report Date</p>
                  <p className="text-sm font-medium text-gray-800">
                    {report.report_date
                      ? new Date(report.report_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Not available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Lab Information */}
            {report.Lab && (
              <div className="p-4 bg-white">
                <div className="flex items-start">
                  <div className="bg-blue-50 p-2 rounded-full mt-0.5">
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-800">
                      {report.Lab.name}
                    </p>

                    {report.Lab.Address && (
                      <div className="mt-1 text-xs text-gray-600">
                        <div className="flex items-start">
                          <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="ml-1.5 leading-relaxed">
                            {report.Lab.Address.street},{" "}
                            {report.Lab.Address.city}{" "}
                            {report.Lab.Address.zip_code}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Debug Card - Display the actual data */}
          <Card className="mb-5 p-4 border border-orange-200 bg-orange-50">
            <h3 className="text-orange-800 font-medium mb-2">
              Debug Information
            </h3>
            <div className="text-xs text-orange-700 font-mono overflow-x-auto">
              <p>Report ID: {report.id}</p>
              <p>Reference: {report.reference_number || "None"}</p>
              <p>
                Health Groups: {report.TestResultsByHealthGroup?.length || 0}
              </p>
              {report.TestResultsByHealthGroup?.length > 0 && (
                <>
                  <p className="mt-2 font-semibold">First Group:</p>
                  <p>
                    Category:{" "}
                    {report.TestResultsByHealthGroup[0]?.HealthCategory?.name ||
                      "Unknown"}
                  </p>
                  <p>
                    Tests:{" "}
                    {report.TestResultsByHealthGroup[0]?.TestResults?.length ||
                      0}
                  </p>
                </>
              )}
            </div>
          </Card>

          {/* Health Categories */}
          {Array.isArray(TestResult) &&
          report.TestResultsByHealthGroup.length > 0 ? (
            <div className="space-y-4 mb-8">
              <h3 className="font-bold text-gray-800 ml-1">
                Health Categories ({report.TestResultsByHealthGroup.length})
              </h3>

              {TestResult.map((group, index) => {
                // Check if this group has all the necessary data
                const hasValidData =
                  group &&
                  group.HealthCategory &&
                  group.HealthCategory.name &&
                  Array.isArray(group.TestResults);

                if (!hasValidData) {
                  console.error("Invalid group structure:", group);
                  return null;
                }
                
                return (
                  <div key={index} className="card-container">
                    <div
                      className={`card-inner ${
                        flippedCategories[index] ? "flipped" : ""
                      }`}
                      style={{
                        minHeight: flippedCategories[index] ? "400px" : "auto",
                      }}
                    >
                      {/* Category Front */}
                      <Card
                        className={`card-front shadow-md border border-gray-200 overflow-hidden ${
                          expandedCategory === index
                            ? "ring-2 ring-blue-300"
                            : ""
                        }`}
                      >
                        <div
                          className="p-4 flex justify-between items-center bg-white cursor-pointer"
                          onClick={() => toggleCategory(index)}
                        >
                          <div className="flex items-center">
                            <div className="bg-blue-50 p-2 rounded-full">
                              {getCategoryIcon(group.HealthCategory.name)}
                            </div>
                            <div className="ml-3">
                              <h3 className="font-medium text-gray-800">
                                {group.HealthCategory.name}
                              </h3>
                              <p className="text-xs text-gray-500">
                                {group.HealthCategory.description ||
                                  "Health category"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {group.Analysis &&
                              group.Analysis["Health Score"] && (
                                <div className="bg-gray-100 rounded-full px-3 py-1 flex items-center">
                                  <div
                                    className={`h-4 w-4 rounded-full bg-gradient-to-r ${getHealthScoreColor(
                                      group.Analysis["Health Score"]
                                    )}`}
                                  ></div>
                                  <span className="ml-1.5 text-xs font-medium text-gray-700">
                                    {group.Analysis["Health Score"]}/10
                                  </span>
                                </div>
                              )}

                            <button
                              className="p-1 text-gray-400 hover:text-blue-500"
                              onClick={(e) => toggleCategoryFlip(index, e)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </button>

                            {expandedCategory === index ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Test Results */}
                        {expandedCategory === index && group.TestResults && (
                          <div className="p-4 space-y-3 bg-gray-50 border-t border-gray-100">
                            {group.TestResults.length > 0 ? (
                              group.TestResults.map((test) => (
                                <div key={test.id} className="card-container">
                                  <div
                                    className={`card-inner ${
                                      flippedTests[test.id] ? "flipped" : ""
                                    }`}
                                    style={{ minHeight: "120px" }}
                                  >
                                    {/* Test Card Front */}
                                    <Card className="card-front shadow-sm border border-gray-200">
                                      <div className="p-3">
                                        <div className="flex justify-between">
                                          <div>
                                            <h4 className="font-medium text-gray-800 text-sm">
                                              {test.LabTest?.name || "Test"}
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                              {test.LabTest
                                                ?.short_description ||
                                                "Test details"}
                                            </p>
                                          </div>
                                          <button
                                            className="p-1 text-gray-400 hover:text-blue-500"
                                            onClick={(e) =>
                                              toggleTestFlip(test.id, e)
                                            }
                                          >
                                            <RefreshCw className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                        <div className="mt-2 flex justify-between items-end">
                                          <div
                                            className={`font-bold text-lg ${getResultStatusColor(
                                              test.result_value,
                                              test.RefRanges
                                            )}`}
                                          >
                                            {test.result_value}
                                          </div>
                                          <div className="text-xs text-gray-500">
                                            {test.units || ""}
                                          </div>
                                        </div>
                                        {test.RefRanges &&
                                          test.RefRanges.length > 0 && (
                                            <div className="mt-1 text-xs text-gray-500">
                                              Normal range:{" "}
                                              {test.RefRanges[0].low} -{" "}
                                              {test.RefRanges[0].high}{" "}
                                              {test.units}
                                            </div>
                                          )}
                                      </div>
                                    </Card>

                                    {/* Test Card Back */}
                                    <Card className="card-back shadow-sm border border-gray-200">
                                      <div className="p-3">
                                        <div className="flex justify-between items-start">
                                          <h4 className="font-medium text-gray-800 text-sm">
                                            {test.LabTest.name}
                                          </h4>
                                          <button
                                            className="p-1 text-gray-400 hover:text-blue-500"
                                            onClick={(e) =>
                                              toggleTestFlip(test.id, e)
                                            }
                                          >
                                            <X className="h-3.5 w-3.5" />
                                          </button>
                                        </div>
                                        <div className="mt-2 space-y-2">
                                          <div>
                                            <p className="text-xs font-medium text-gray-500">
                                              DESCRIPTION
                                            </p>
                                            <p className="text-sm text-gray-700">
                                              {test.LabTest.long_description ||
                                                test.LabTest.short_description}
                                            </p>
                                          </div>

                                          {test.RefRanges &&
                                            test.RefRanges.length > 0 && (
                                              <div>
                                                <p className="text-xs font-medium text-gray-500">
                                                  REFERENCE RANGES
                                                </p>
                                                {test.RefRanges.map(
                                                  (range, idx) => (
                                                    <div
                                                      key={idx}
                                                      className="text-sm text-gray-700"
                                                    >
                                                      <span>
                                                        {range.low} -{" "}
                                                        {range.high}{" "}
                                                        {test.units}
                                                      </span>
                                                      {range.interpretation &&
                                                        range.interpretation !==
                                                          "-" && (
                                                          <span className="text-xs text-gray-500 block mt-0.5">
                                                            {
                                                              range.interpretation
                                                            }
                                                          </span>
                                                        )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                            )}

                                          <div className="pt-1">
                                            <p className="text-xs font-medium text-gray-500">
                                              YOUR RESULT
                                            </p>
                                            <p
                                              className={`text-sm font-bold ${getResultStatusColor(
                                                test.result_value,
                                                test.RefRanges
                                              )}`}
                                            >
                                              {test.result_value} {test.units}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </Card>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-gray-500 p-4">
                                No test results available for this category
                              </p>
                            )}
                          </div>
                        )}
                      </Card>

                      {/* Category Back - Analysis & Recommendations */}
                      <Card className="card-back shadow-md border border-gray-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 flex justify-between items-center">
                          <h3 className="font-medium text-white">
                            {group.HealthCategory.name} Analysis
                          </h3>
                          <button
                            className="text-white hover:bg-white/20 p-1 rounded"
                            onClick={(e) => toggleCategoryFlip(index, e)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="p-4 max-h-[400px] overflow-y-auto">
                          {group.Analysis && (
                            <div className="space-y-4">
                              {/* Health Score */}
                              <div className="bg-indigo-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-indigo-800">
                                    Health Score
                                  </span>
                                  <div className="flex items-center">
                                    <div
                                      className={`h-4 w-4 rounded-full bg-gradient-to-r ${getHealthScoreColor(
                                        group.Analysis["Health Score"]
                                      )}`}
                                    ></div>
                                    <span className="ml-1.5 font-bold text-indigo-700">
                                      {group.Analysis["Health Score"]}/10
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Detailed Analysis */}
                              {group.Analysis["Detailed Analysis"] && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Detailed Analysis
                                  </h4>
                                  <div className="space-y-2">
                                    {Object.entries(
                                      group.Analysis["Detailed Analysis"]
                                    ).map(([key, analysis], idx) => (
                                      <div
                                        key={idx}
                                        className="bg-white p-3 rounded-lg border border-gray-200"
                                      >
                                        <div className="flex justify-between">
                                          <span className="text-sm font-medium text-gray-800">
                                            {key}
                                          </span>
                                          <span
                                            className={`text-xs px-2 py-0.5 rounded ${
                                              analysis.Interpretation ===
                                              "Normal"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                          >
                                            {analysis.Interpretation}
                                          </span>
                                        </div>
                                        <div className="mt-1 text-sm text-gray-700">
                                          {analysis.Value}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Summary */}
                              {group.Analysis.Summary && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Summary
                                  </h4>
                                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                                    {group.Analysis.Summary[
                                      "Key Observations"
                                    ] && (
                                      <div>
                                        <p className="text-xs font-medium text-gray-500">
                                          KEY OBSERVATIONS
                                        </p>
                                        <ul className="mt-1 text-sm text-gray-700">
                                          {group.Analysis.Summary[
                                            "Key Observations"
                                          ].map((obs, i) => (
                                            <li
                                              key={i}
                                              className="flex items-start mt-1"
                                            >
                                              <span className="mr-1.5 text-indigo-500">
                                                •
                                              </span>
                                              {obs}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {group.Analysis.Summary[
                                      "Overall Kidney Health"
                                    ] && (
                                      <div className="mt-3">
                                        <p className="text-xs font-medium text-gray-500">
                                          OVERALL HEALTH
                                        </p>
                                        <p className="text-sm font-medium text-indigo-700 mt-1">
                                          {
                                            group.Analysis.Summary[
                                              "Overall Kidney Health"
                                            ]
                                          }
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Recommendations */}
                              {group.Analysis.Recommendations && (
                                <div>
                                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                                    Recommendations
                                  </h4>
                                  <div className="space-y-2">
                                    {Object.entries(
                                      group.Analysis.Recommendations
                                    ).map(([key, recs], idx) => (
                                      <div
                                        key={idx}
                                        className="bg-white p-3 rounded-lg border border-gray-200"
                                      >
                                        <p className="text-xs font-medium text-gray-500">
                                          {key}
                                        </p>
                                        <ul className="mt-1">
                                          {recs.map((rec, i) => (
                                            <li
                                              key={i}
                                              className="text-sm text-gray-700 flex items-start mt-1"
                                            >
                                              <span className="mr-1.5 text-green-500">
                                                •
                                              </span>
                                              {rec}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card className="mb-5 p-4 text-center">
              <p className="text-gray-600">
                No health category data available for this report.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Raw data: {JSON.stringify(report.TestResultsByHealthGroup)}
              </p>
            </Card>
          )}

          {/* Actions Card */}
          <div className="flex flex-col mt-8 space-y-3">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl shadow-md"
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
                <span className="font-semibold">Print Health Report</span>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full border-gray-300 py-5 rounded-xl"
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

export default LabReportDetail;
