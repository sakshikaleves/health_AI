"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  Info,
  AlertCircle,
  X,
} from "lucide-react";
import { toast } from "sonner";

const LabReportDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(0);
  const [flippedCategories, setFlippedCategories] = useState({});
  const [flippedTests, setFlippedTests] = useState({});

  useEffect(() => {
    const fetchLabReport = async () => {
      setIsLoading(true);
      try {
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
        
        if (!data || !data.TestResultsByHealthGroup) {
          console.error("Invalid data format:", data);
          throw new Error("Received invalid data format from API");
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

  const toggleExpandCategory = (index) => {
    setExpandedCategory(expandedCategory === index ? -1 : index);
  };

  const toggleCategoryFlip = (index, e) => {
    e?.stopPropagation();
    setFlippedCategories(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleTestFlip = (categoryIndex, testIndex, e) => {
    e?.stopPropagation();
    const key = `${categoryIndex}-${testIndex}`;
    setFlippedTests(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">Loading lab report...</p>
          <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your health data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen">
        <BackButton onClick={() => router.back()} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Report</AlertTitle>
          <AlertDescription>
            {error}
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!report || !report.TestResultsByHealthGroup) {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen">
        <BackButton onClick={() => router.back()} />
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No Report Data</AlertTitle>
          <AlertDescription>
            No health report data was found. This could be due to a missing or invalid
            report ID.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-16 pt-20 bg-slate-50 min-h-screen">
      <BackButton onClick={() => router.push("/records")} />

      {/* Lab Report Header Card */}
      <Card className="mb-5 overflow-hidden border border-gray-200 shadow-md">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-white text-lg font-bold">Health Report</h2>
              <p className="text-blue-100 text-sm mt-1">
                {report.Lab?.name || "Medical Laboratory"}
              </p>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {/* Patient Info */}
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="flex justify-between">
              <div className="flex items-center">
                <div className="bg-blue-50 p-1.5 rounded-md">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <div className="ml-2">
                  <p className="text-xs text-gray-500">Report Date</p>
                  <p className="text-sm font-medium text-gray-800">
                    {report.report_date
                      ? new Date(report.report_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "Not available"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 text-right">Ref Number</p>
                <p className="text-sm font-medium text-gray-800">{report.reference_number || "N/A"}</p>
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
                  <p className="text-sm font-medium text-gray-800">{report.Lab.name}</p>
                  {report.Lab.Address && (
                    <div className="mt-1 text-xs text-gray-600">
                      <div className="flex items-start">
                        <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="ml-1.5 leading-relaxed">
                          {report.Lab.Address.street}, {report.Lab.Address.city} {report.Lab.Address.zip_code}
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

      {/* Health Categories */}
      <div className="space-y-4 mb-8">
        <h3 className="font-bold text-gray-800 ml-1">
          Health Categories ({report.TestResultsByHealthGroup.length})
        </h3>

        {report.TestResultsByHealthGroup.map((group, index) => (
          <div key={index} className="transition-all duration-300">
            <CategoryCard
              healthGroup={group}
              index={index}
              isExpanded={expandedCategory === index}
              isFlipped={flippedCategories[index]}
              toggleExpand={() => toggleExpandCategory(index)}
              toggleFlip={(e) => toggleCategoryFlip(index, e)}
              toggleTestFlip={toggleTestFlip}
              flippedTests={flippedTests}
            />
          </div>
        ))}
      </div>

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
            <span className="font-semibold text-gray-700">Share Report</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

// Category Card Component
const CategoryCard = ({
  healthGroup,
  index,
  isExpanded,
  isFlipped,
  toggleExpand,
  toggleFlip,
  toggleTestFlip,
  flippedTests
}) => {
  const { HealthCategory, Analysis, TestResults } = healthGroup;

  // Get badge variant based on health score
  const getScoreBadgeVariant = (score) => {
    if (score >= 8) return "bg-green-100 text-green-700";
    if (score >= 6) return "bg-blue-100 text-blue-700";
    if (score >= 4) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  // Check if we have all needed data
  if (!HealthCategory || !HealthCategory.name) {
    return null;
  }
    const analysis = Analysis || {};
    const tabKeys   = Object.entries(analysis)
                           .filter(([k,v]) => v && typeof v === 'object')
                           .map(([k]) => k);
 

  return (
    <Card
      className={`overflow-hidden shadow-md border ${
        isExpanded ? "ring-2 ring-blue-300" : "border-gray-200"
      }`}
    >
      <div className="relative">
        {/* Front side of Category Card */}
        <div
          className={`transition-all duration-500 ${
            isFlipped ? "hidden" : "block"
          }`}
        >
          <CardHeader
            className="p-4 cursor-pointer bg-white"
            onClick={toggleExpand}
          >
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-gray-800 font-medium text-base">
                  {HealthCategory.name}
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 mt-0.5">
                  {HealthCategory.description || "Health category"}
                </CardDescription>
              </div>
              <div className="flex flex-col items-end space-y-2">
                {Analysis && Analysis["Health Score"] && (
                  <Badge
                    className={getScoreBadgeVariant(Analysis["Health Score"])}
                  >
                    Score: {Analysis["Health Score"]}/10
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="p-1 h-7 w-7 text-gray-400 hover:text-blue-500"
                    onClick={(e) => toggleFlip(e)}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          {isExpanded && TestResults && (
            <CardContent className="p-4 space-y-3 bg-gray-50 border-t border-gray-100">
              {TestResults.length > 0 ? (
                TestResults.map((test, testIndex) => (
                  <TestCard
                    key={testIndex}
                    test={test}
                    categoryIndex={index}
                    testIndex={testIndex}
                    isFlipped={flippedTests[`${index}-${testIndex}`]}
                    toggleFlip={(e) => toggleTestFlip(index, testIndex, e)}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 p-2">
                  No test results available for this category
                </p>
              )}
            </CardContent>
          )}
        </div>
      </div>
      {/* Back side of Category Card - Analysis & Recommendations */}
      <div
        className={`transition-all duration-500 ${
          isFlipped ? "block" : "hidden"
        }`}
      >
        <CardHeader className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex justify-between items-center">
          <div>
            <CardTitle className="text-white font-medium">
              {HealthCategory.name} Analysis
            </CardTitle>
            <CardDescription className="text-white/80 text-sm">
              Detailed health information
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-white hover:bg-white/20"
            onClick={(e) => toggleFlip(e)}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="p-4">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid grid-cols-3 gap-x-4  mb-4">
              <TabsTrigger className={`
        flex-1 text-center py-2
        border-b-2 border-transparent
        hover:bg-gray-50
        data-[state=active]:border-blue-500
        data-[state=active]:text-blue-600
        data-[state=active]:font-semibold
        transition
      `} value="explaination">Explanation</TabsTrigger>
              <TabsTrigger className={`
        flex-1 text-center py-2
        border-b-2 border-transparent
        hover:bg-gray-50
        data-[state=active]:border-blue-500
        data-[state=active]:text-blue-600
        data-[state=active]:font-semibold
        transition
      `} value="recommendations">Recommendations</TabsTrigger>
              <TabsTrigger className={`
        flex-1 text-center py-2
        border-b-2 border-transparent
        hover:bg-gray-50
        data-[state=active]:border-blue-500
        data-[state=active]:text-blue-600
        data-[state=active]:font-semibold
        transition
      `} value="details">Details</TabsTrigger>
            </TabsList>

  {tabKeys.map((tab, i) => (
    <TabsContent key={tab} value={tab.toLowerCase()} className="space-y-4">
  	{Object.entries(analysis[tab])
		.filter(([_, items]) => Array.isArray(items))
		.map(([heading, items]) => (
	  <section key={heading} className="mb-4">
            <h4>{heading}</h4>
            <ul>
              {items.map((item, idx) => (
                <li
                  key={idx}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </ul>
          </section>
        ))}
      </TabsContent>,
   ))}
            <TabsContent value="details">
              <div className="prose prose-sm max-w-none">
                <p>
                  {HealthCategory.description || "No description available"}
                </p>
                <div className="mt-4">
                  <h3 className="font-medium">Test Summary</h3>
                  <div className="mt-2 space-y-2">
                    {TestResults?.map((test, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">
                          {test.LabTest?.name || "Test"}:
                        </span>{" "}
                        {test.result_value} {test.units}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
  </Tabs>
  
		{/*
            <TabsContent value="analysis" className="space-y-4">
              {Analysis?.["Explaination"] &&
                Object.entries(Analysis["Explaination"]).map(
                  ([key, data], i) => (
                    <div key={i} className="border rounded-lg p-3">
                      <h3 className="font-medium">{key}</h3>
			   <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                        	{data.map((item, j) => (
                          		<li key={j}>{item}</li>
                        	))}
                      </ul>

                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        <div>
                          <span className="font-medium">Value:</span>{" "}
                          {data.Value}
                        </div>
                        <div>
                          <span className="font-medium">Interpretation:</span>{" "}
                          {data.Interpretation}
                        </div>
                      </div>
                    </div>
                  )
                )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              {Analysis?.Recommendations && (
                <div className="space-y-4">
                  {Analysis.Recommendations.Diet?.length > 0 && (
                    <div>
                      <h3 className="font-medium">Diet Recommendations</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                        {Analysis.Recommendations.Diet.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Analysis.Recommendations["Medical Followups"]?.length >
                    0 && (
                    <div>
                      <h3 className="font-medium">Medical Followups</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                        {Analysis.Recommendations["Medical Followups"].map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {Analysis.Recommendations["Physical Activity"]?.length >
                    0 && (
                    <div>
                      <h3 className="font-medium">Physical Activity</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                        {Analysis.Recommendations["Physical Activity"].map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {Analysis.Recommendations["Supplementation"]?.length >
                    0 && (
                    <div>
                      <h3 className="font-medium">Supplementation</h3>
                      <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
                        {Analysis.Recommendations["Supplementation"].map(
                          (item, i) => (
                            <li key={i}>{item}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="details">
              <div className="prose prose-sm max-w-none">
                <p>
                  {HealthCategory.description || "No description available"}
                </p>
                <div className="mt-4">
                  <h3 className="font-medium">Test Summary</h3>
                  <div className="mt-2 space-y-2">
                    {TestResults?.map((test, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">
                          {test.LabTest?.name || "Test"}:
                        </span>{" "}
                        {test.result_value} {test.units}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
			*/}
        </CardContent>
      </div>
    </Card>
  );
};

// Test Card Component
const TestCard = ({ test, categoryIndex, testIndex, isFlipped, toggleFlip }) => {
  if (!test || !test.LabTest) {
    return null;
  }

  const { LabTest, result_value, units, RefRanges } = test;

  // Determine if value is within reference range
  const isNormal = () => {
    if (!RefRanges || RefRanges.length === 0) return true;
    const range = RefRanges[0];
    const low = parseFloat(range.low);
    const high = parseFloat(range.high);
    const value = parseFloat(result_value);

    if (isNaN(value) || isNaN(low) || isNaN(high)) return true;
    return value >= low && value <= high;
  };
  
  const getStatusVariant = () => {
    if (isNormal()) return "bg-green-100 text-green-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <Card className="overflow-hidden shadow-sm border border-gray-200">
      <div className="relative">
        {/* Front of Test Card */}
        <div className={`transition-all duration-300 ${isFlipped ? "hidden" : "block"}`}>
          <CardHeader className="py-3 px-4 flex justify-between items-center">
            <CardTitle className="text-base font-medium">{LabTest.name}</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={toggleFlip}
            >
              <Info className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="py-2 px-4">
            <div className="flex justify-between items-center">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">{result_value}</span>
                <span className="text-sm text-gray-500">{units}</span>
              </div>
              
              <Badge className={getStatusVariant()}>
                {isNormal() ? "Normal" : "Abnormal"}
              </Badge>
            </div>
            
            {RefRanges && RefRanges.length > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Reference range: {RefRanges[0].low} - {RefRanges[0].high} {units}
              </p>
            )}
          </CardContent>
        </div>

        {/* Back of Test Card */}
        <div className={`transition-all duration-300 ${isFlipped ? "block" : "hidden"}`}>
          <CardHeader className="py-3 px-4 flex justify-between items-center">
            <div>
              <CardTitle className="text-base font-medium">{LabTest.name}</CardTitle>
              <CardDescription>{LabTest.test_group || ""}</CardDescription>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0"
              onClick={toggleFlip}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="py-2 px-4 space-y-3">
            <div>
              <h4 className="text-sm font-medium">Description</h4>
              <p className="text-sm">{LabTest.short_description || LabTest.long_description || "No description available"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium">Reference Range</h4>
              {RefRanges && RefRanges.length > 0 ? (
                <div className="text-sm">
                  <p>{RefRanges[0].low} - {RefRanges[0].high} {units}</p>
                  {RefRanges[0].interpretation && (
                    <p className="text-xs text-gray-500 mt-1">{RefRanges[0].interpretation}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm">No reference range data available</p>
              )}
            </div>

            <div>
              <h4 className="text-sm font-medium">Your Result</h4>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">{result_value}</span>
                <span className="text-sm text-gray-500">{units}</span>
                <Badge className={`ml-2 ${getStatusVariant()}`}>
                  {isNormal() ? "Normal" : "Abnormal"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
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
    <span className="font-medium text-gray-700">Back to Records</span>
  </Button>
);

export default LabReportDetail;
