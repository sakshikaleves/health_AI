// "use client";
// // D:\New folder (2)\original_mahul\app-frontend\src\app\labreport\[id]\page.js
// import React, { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';


// import { Button } from "@/components/ui/button";

// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import {
//   Loader2,
//   ArrowLeft,
//   FileText,
//   Building,
//   MapPin,
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   RefreshCw,
//   Heart,
//   Activity,
//   Info,
//   AlertCircle,
//   X,
// } from "lucide-react";
// import { toast } from "sonner";

// const LabReportDetail = () => {
//   const { id } = useParams();
//   const router = useRouter();
//   const [report, setReport] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedCategory, setExpandedCategory] = useState(0);
//   const [flippedCategories, setFlippedCategories] = useState({});
//   const [flippedTests, setFlippedTests] = useState({});

//   useEffect(() => {
//     const fetchLabReport = async () => {
//       setIsLoading(true);
//       try {
//         console.log(`Fetching lab report for ID: ${id}`);
//         const apiUrl = `/api/proxy/labreport/${id}?byTestGroup=True`;
//         console.log(`Using API URL: ${apiUrl}`);
        
//         const response = await fetch(apiUrl);

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error(`API response not OK: ${response.status}`, errorText);
//           throw new Error(
//             `Failed to fetch report (Status: ${response.status}): ${errorText}`
//           );
//         }

//         const data = await response.json();
//         console.log("Lab report data received:", data);
        
//         if (!data || !data.TestResultsByHealthGroup) {
//           console.error("Invalid data format:", data);
//           throw new Error("Received invalid data format from API");
//         }
        
//         setReport(data);
//       } catch (err) {
//         console.error("Error fetching lab report:", err);
//         setError(err.message || "Failed to load lab report");
//         toast.error("Could not load lab report details");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (id) {
//       fetchLabReport();
//     }
//   }, [id]);

//   const toggleExpandCategory = (index) => {
//     setExpandedCategory(expandedCategory === index ? -1 : index);
//   };

//   const toggleCategoryFlip = (index, e) => {
//     e?.stopPropagation();
//     setFlippedCategories(prev => ({
//       ...prev,
//       [index]: !prev[index]
//     }));
//   };

//   const toggleTestFlip = (categoryIndex, testIndex, e) => {
//     e?.stopPropagation();
//     const key = `${categoryIndex}-${testIndex}`;
//     setFlippedTests(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   if (isLoading) {
//     return (
//       <div className="max-w-md mx-auto p-4 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-10 w-10 mx-auto text-blue-600 animate-spin" />
//           <p className="mt-4 text-gray-600 font-medium">Loading lab report...</p>
//           <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your health data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-md mx-auto p-4 min-h-screen">
//         <BackButton onClick={() => router.back()} />
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error Loading Report</AlertTitle>
//           <AlertDescription>
//             {error}
//             <div className="mt-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => window.location.reload()}
//               >
//                 Try Again
//               </Button>
//             </div>
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   if (!report || !report.TestResultsByHealthGroup) {
//     return (
//       <div className="max-w-md mx-auto p-4 min-h-screen">
//         <BackButton onClick={() => router.back()} />
//         <Alert>
//           <Info className="h-4 w-4" />
//           <AlertTitle>No Report Data</AlertTitle>
//           <AlertDescription>
//             No health report data was found. This could be due to a missing or invalid
//             report ID.
//           </AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-md mx-auto p-4 pb-16 pt-20 bg-slate-50 min-h-screen">
//       <BackButton onClick={() => router.push("/records")} />

//       {/* Lab Report Header Card */}
//       <Card className="mb-5 overflow-hidden border border-gray-200 shadow-md">
//         onClick={() => toggleFlip()}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
//           <div className="flex justify-between items-start">
//             <div>
//               <h2 className="text-white text-lg font-bold">Health Report</h2>
//               <p className="text-blue-100 text-sm mt-1">
//                 {report.Lab?.name || "Medical Laboratory"}
//               </p>
//             </div>
//           </div>
//         </div>

//         <CardContent className="p-0">
//           {/* Patient Info */}
//           <div className="p-4 border-b border-gray-100 bg-white">
//             <div className="flex justify-between">
//               <div className="flex items-center">
//                 <div className="bg-blue-50 p-1.5 rounded-md">
//                   <Calendar className="h-4 w-4 text-blue-600" />
//                 </div>
//                 <div className="ml-2">
//                   <p className="text-xs text-gray-500">Report Date</p>
//                   <p className="text-sm font-medium text-gray-800">
//                     {report.report_date
//                       ? new Date(report.report_date).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })
//                       : "Not available"}
//                   </p>
//                 </div>
//               </div>
//               <div>
//                 <p className="text-xs text-gray-500 text-right">Ref Number</p>
//                 <p className="text-sm font-medium text-gray-800">{report.reference_number || "N/A"}</p>
//               </div>
//             </div>
//           </div>

//           {/* Lab Information */}
//           {report.Lab && (
//             <div className="p-4 bg-white">
//               <div className="flex items-start">
//                 <div className="bg-blue-50 p-2 rounded-full mt-0.5">
//                   <Building className="h-4 w-4 text-blue-600" />
//                 </div>
//                 <div className="ml-3">
//                   <p className="text-sm font-medium text-gray-800">{report.Lab.name}</p>
//                   {report.Lab.Address && (
//                     <div className="mt-1 text-xs text-gray-600">
//                       <div className="flex items-start">
//                         <MapPin className="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
//                         <div className="ml-1.5 leading-relaxed">
//                           {report.Lab.Address.street}, {report.Lab.Address.city} {report.Lab.Address.zip_code}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Health Categories */}
//       <div className="space-y-4 mb-8">
//         <h3 className="font-bold text-gray-800 ml-1">
//           Health Categories ({report.TestResultsByHealthGroup.length})
//         </h3>

//         {report.TestResultsByHealthGroup.map((group, index) => (
//           <div key={index} className="transition-all duration-300">
//             <CategoryCard
//               healthGroup={group}
//               index={index}
//               isExpanded={expandedCategory === index}
//               isFlipped={flippedCategories[index]}
//               toggleExpand={() => toggleExpandCategory(index)}
//               toggleFlip={(e) => toggleCategoryFlip(index, e)}
//               toggleTestFlip={toggleTestFlip}
//               flippedTests={flippedTests}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Actions Card */}
//       <div className="flex flex-col mt-8 space-y-3">
//         <Button
//           className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-xl shadow-md"
//           onClick={() => window.print()}
//         >
//           <div className="flex items-center justify-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span className="font-semibold">Print Health Report</span>
//           </div>
//         </Button>

//         <Button
//           variant="outline"
//           className="w-full border-gray-300 py-5 rounded-xl"
//           onClick={() => router.push(`/shared/labreport/${report.id}`)}
//         >
//           <div className="flex items-center justify-center">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2 text-gray-600"
//               viewBox="0 0 20 20"
//               fill="currentColor"
//             >
//               <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
//             </svg>
//             <span className="font-semibold text-gray-700">Share Report</span>
//           </div>
//         </Button>
//       </div>
//     </div>
//   );
// };

// // Category Card Component
// const CategoryCard = ({
//   healthGroup,
//   index,
//   isExpanded,
//   isFlipped,
//   toggleExpand,
//   toggleFlip,
//   toggleTestFlip,
//   flippedTests
// }) => {
//   const { HealthCategory, Analysis, TestResults } = healthGroup;

//   // Get badge variant based on health score
//   const getScoreBadgeVariant = (score) => {
//     if (score >= 8) return "bg-green-100 text-green-700";
//     if (score >= 6) return "bg-blue-100 text-blue-700";
//     if (score >= 4) return "bg-yellow-100 text-yellow-700";
//     return "bg-red-100 text-red-700";
//   };

//   // Check if we have all needed data
//   if (!HealthCategory || !HealthCategory.name) {
//     return null;
//   }
//     const analysis = Analysis || {};
//     const tabKeys   = Object.entries(analysis)
//                            .filter(([k,v]) => v && typeof v === 'object')
//                            .map(([k]) => k);
 

//   return (
//     <Card
//       className={`overflow-hidden shadow-md border ${
//         isExpanded ? "ring-2 ring-blue-300" : "border-gray-200"
//       }`}
//        >
//       <div className="relative">
//         {/* Front side of Category Card */}
//         <div
//           className={`transition-all duration-500 ${
//             isFlipped ? "hidden" : "block"
//           }`}
//         >
//           <CardHeader
//             className="p-4 cursor-pointer bg-white"
//             onClick={toggleExpand}
//           >
//             <div className="flex justify-between items-center">
//               <div>
//                 <CardTitle className="text-gray-800 font-medium text-base">
//                   {HealthCategory.name}
//                 </CardTitle>
//                 <CardDescription className="text-xs text-gray-500 mt-0.5">
//                   {HealthCategory.description || "Health category"}
//                 </CardDescription>
//               </div>
//               <div className="flex flex-col items-end space-y-2">
//                 {Analysis && Analysis["Health Score"] && (
//                   <Badge
//                     className={getScoreBadgeVariant(Analysis["Health Score"])}
//                   >
//                     Score: {Analysis["Health Score"]}/10
//                   </Badge>
//                 )}
//                 <div className="flex items-center space-x-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="p-1 h-7 w-7 text-gray-400 hover:text-blue-500"
//                     onClick={(e) => toggleFlip(e)}
//                   >
//                     <RefreshCw className="h-4 w-4" />
//                   </Button>
//                   {isExpanded ? (
//                     <ChevronUp className="h-5 w-5 text-gray-500" />
//                   ) : (
//                     <ChevronDown className="h-5 w-5 text-gray-500" />
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardHeader>

//           {isExpanded && TestResults && (
//             <CardContent className="p-4 space-y-3 bg-gray-50 border-t border-gray-100">
//               {TestResults.length > 0 ? (
//                 TestResults.map((test, testIndex) => (
//                   <TestCard
//                     key={testIndex}
//                     test={test}
//                     categoryIndex={index}
//                     testIndex={testIndex}
//                     isFlipped={flippedTests[`${index}-${testIndex}`]}
//                     toggleFlip={(e) => toggleTestFlip(index, testIndex, e)}
//                   />
//                 ))
//               ) : (
//                 <p className="text-center text-gray-500 p-2">
//                   No test results available for this category
//                 </p>
//               )}
//             </CardContent>
//           )}
//         </div>
//       </div>
//       {/* Back side of Category Card - Analysis & Recommendations */}
//       <div
//         className={`transition-all duration-500 ${
//           isFlipped ? "block" : "hidden"
//         }`}
//       >
//         <CardHeader className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white flex justify-between items-center">
//           <div>
//             <CardTitle className="text-white font-medium">
//               {HealthCategory.name} Analysis
//             </CardTitle>
//             <CardDescription className="text-white/80 text-sm">
//               Detailed health information
//             </CardDescription>
//           </div>
//           <Button
//             variant="ghost"
//             size="sm"
//             className="h-8 w-8 p-0 text-white hover:bg-white/20"
//             onClick={(e) => toggleFlip(e)}
//           >
//             <X className="h-4 w-4" />
//           </Button>
//         </CardHeader>

//         <CardContent className="p-4">
//           <Tabs defaultValue="analysis" className="w-full">
//             <TabsList className="grid grid-cols-3 gap-x-4  mb-4">
//               <TabsTrigger className={`
//         flex-1 text-center py-2
//         border-b-2 border-transparent
//         hover:bg-gray-50
//         data-[state=active]:border-blue-500
//         data-[state=active]:text-blue-600
//         data-[state=active]:font-semibold
//         transition
//       `} value="explaination">Explanation</TabsTrigger>
//               <TabsTrigger className={`
//         flex-1 text-center py-2
//         border-b-2 border-transparent
//         hover:bg-gray-50
//         data-[state=active]:border-blue-500
//         data-[state=active]:text-blue-600
//         data-[state=active]:font-semibold
//         transition
//       `} value="recommendations">Recommendations</TabsTrigger>
//               <TabsTrigger className={`
//         flex-1 text-center py-2
//         border-b-2 border-transparent
//         hover:bg-gray-50
//         data-[state=active]:border-blue-500
//         data-[state=active]:text-blue-600
//         data-[state=active]:font-semibold
//         transition
//       `} value="details">Details</TabsTrigger>
//             </TabsList>

//   {tabKeys.map((tab, i) => (
//     <TabsContent key={tab} value={tab.toLowerCase()} className="space-y-4">
//   	{Object.entries(analysis[tab])
// 		.filter(([_, items]) => Array.isArray(items))
// 		.map(([heading, items]) => (
// 	  <section key={heading} className="mb-4">
//             <h4>{heading}</h4>
//             <ul>
//               {items.map((item, idx) => (
//                 <li
//                   key={idx}
//                   dangerouslySetInnerHTML={{ __html: item }}
//                 />
//               ))}
//             </ul>
//           </section>
//         ))}
//       </TabsContent>,
//    ))}
//             <TabsContent value="details">
//               <div className="prose prose-sm max-w-none">
//                 <p>
//                   {HealthCategory.description || "No description available"}
//                 </p>
//                 <div className="mt-4">
//                   <h3 className="font-medium">Test Summary</h3>
//                   <div className="mt-2 space-y-2">
//                     {TestResults?.map((test, i) => (
//                       <div key={i} className="text-sm">
//                         <span className="font-medium">
//                           {test.LabTest?.name || "Test"}:
//                         </span>{" "}
//                         {test.result_value} {test.units}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//   </Tabs>
  
// 		{/*
//             <TabsContent value="analysis" className="space-y-4">
//               {Analysis?.["Explaination"] &&
//                 Object.entries(Analysis["Explaination"]).map(
//                   ([key, data], i) => (
//                     <div key={i} className="border rounded-lg p-3">
//                       <h3 className="font-medium">{key}</h3>
// 			   <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
//                         	{data.map((item, j) => (
//                           		<li key={j}>{item}</li>
//                         	))}
//                       </ul>

//                       <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
//                         <div>
//                           <span className="font-medium">Value:</span>{" "}
//                           {data.Value}
//                         </div>
//                         <div>
//                           <span className="font-medium">Interpretation:</span>{" "}
//                           {data.Interpretation}
//                         </div>
//                       </div>
//                     </div>
//                   )
//                 )}
//             </TabsContent>

//             <TabsContent value="recommendations" className="space-y-4">
//               {Analysis?.Recommendations && (
//                 <div className="space-y-4">
//                   {Analysis.Recommendations.Diet?.length > 0 && (
//                     <div>
//                       <h3 className="font-medium">Diet Recommendations</h3>
//                       <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
//                         {Analysis.Recommendations.Diet.map((item, i) => (
//                           <li key={i}>{item}</li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}

//                   {Analysis.Recommendations["Medical Followups"]?.length >
//                     0 && (
//                     <div>
//                       <h3 className="font-medium">Medical Followups</h3>
//                       <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
//                         {Analysis.Recommendations["Medical Followups"].map(
//                           (item, i) => (
//                             <li key={i}>{item}</li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   )}

//                   {Analysis.Recommendations["Physical Activity"]?.length >
//                     0 && (
//                     <div>
//                       <h3 className="font-medium">Physical Activity</h3>
//                       <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
//                         {Analysis.Recommendations["Physical Activity"].map(
//                           (item, i) => (
//                             <li key={i}>{item}</li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   )}

//                   {Analysis.Recommendations["Supplementation"]?.length >
//                     0 && (
//                     <div>
//                       <h3 className="font-medium">Supplementation</h3>
//                       <ul className="list-disc pl-5 text-sm space-y-1 mt-2">
//                         {Analysis.Recommendations["Supplementation"].map(
//                           (item, i) => (
//                             <li key={i}>{item}</li>
//                           )
//                         )}
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </TabsContent>

//             <TabsContent value="details">
//               <div className="prose prose-sm max-w-none">
//                 <p>
//                   {HealthCategory.description || "No description available"}
//                 </p>
//                 <div className="mt-4">
//                   <h3 className="font-medium">Test Summary</h3>
//                   <div className="mt-2 space-y-2">
//                     {TestResults?.map((test, i) => (
//                       <div key={i} className="text-sm">
//                         <span className="font-medium">
//                           {test.LabTest?.name || "Test"}:
//                         </span>{" "}
//                         {test.result_value} {test.units}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
// 			*/}
//         </CardContent>
//       </div>
//     </Card>
//   );
// };

// // Test Card Component
// const TestCard = ({ test, categoryIndex, testIndex, isFlipped, toggleFlip }) => {
//   if (!test || !test.LabTest) {
//     return null;
//   }

//   const { LabTest, result_value, units, RefRanges } = test;

//   // Determine if value is within reference range
//   const isNormal = () => {
//     if (!RefRanges || RefRanges.length === 0) return true;
//     const range = RefRanges[0];
//     const low = parseFloat(range.low);
//     const high = parseFloat(range.high);
//     const value = parseFloat(result_value);

//     if (isNaN(value) || isNaN(low) || isNaN(high)) return true;
//     return value >= low && value <= high;
//   };
  
//   const getStatusVariant = () => {
//     if (isNormal()) return "bg-green-100 text-green-700";
//     return "bg-red-100 text-red-700";
//   };

//   return (
//     <Card 
//      onClick={toggleFlip} // ✅ THIS is the correct place
//           className="overflow-hidden shadow-sm border border-gray-200 cursor-pointer"
// >
//       <div className="relative">
//         {/* Front of Test Card */}
//         <div className={`transition-all duration-300 ${isFlipped ? "hidden" : "block"}`}>
//           <CardHeader className="py-3 px-4 flex justify-between items-center">
//             <CardTitle className="text-base font-medium">{LabTest.name}</CardTitle>
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               className="h-7 w-7 p-0"
//               onClick={toggleFlip}
//             >
//               <Info className="h-4 w-4" />
//             </Button>
//           </CardHeader>

//           <CardContent className="py-2 px-4">
//             <div className="flex justify-between items-center">
//               <div className="flex items-baseline gap-2">
//                 <span className="text-lg font-bold">{result_value}</span>
//                 <span className="text-sm text-gray-500">{units}</span>
//               </div>
              
//               <Badge className={getStatusVariant()}>
//                 {isNormal() ? "Normal" : "Abnormal"}
//               </Badge>
//             </div>
            
//             {RefRanges && RefRanges.length > 0 && (
//               <p className="text-xs text-gray-500 mt-2">
//                 Reference range: {RefRanges[0].low} - {RefRanges[0].high} {units}
//               </p>
//             )}
//           </CardContent>
//         </div>

//         {/* Back of Test Card */}
//         <div className={`transition-all duration-300 ${isFlipped ? "block" : "hidden"}`}>
//           <CardHeader className="py-3 px-4 flex justify-between items-center">
//             <div>
//               <CardTitle className="text-base font-medium">{LabTest.name}</CardTitle>
//               <CardDescription>{LabTest.test_group || ""}</CardDescription>
//             </div>
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               className="h-7 w-7 p-0"
//               onClick={toggleFlip}
//             >
//               <X className="h-4 w-4" />
//             </Button>
//           </CardHeader>

//           <CardContent className="py-2 px-4 space-y-3">
//             <div>
//               <h4 className="text-sm font-medium">Description</h4>
//               <p className="text-sm">{LabTest.short_description || LabTest.long_description || "No description available"}</p>
//             </div>

//             <div>
//               <h4 className="text-sm font-medium">Reference Range</h4>
//               {RefRanges && RefRanges.length > 0 ? (
//                 <div className="text-sm">
//                   <p>{RefRanges[0].low} - {RefRanges[0].high} {units}</p>
//                   {RefRanges[0].interpretation && (
//                     <p className="text-xs text-gray-500 mt-1">{RefRanges[0].interpretation}</p>
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-sm">No reference range data available</p>
//               )}
//             </div>

//             <div>
//               <h4 className="text-sm font-medium">Your Result</h4>
//               <div className="flex items-baseline gap-2">
//                 <span className="text-lg font-bold">{result_value}</span>
//                 <span className="text-sm text-gray-500">{units}</span>
//                 <Badge className={`ml-2 ${getStatusVariant()}`}>
//                   {isNormal() ? "Normal" : "Abnormal"}
//                 </Badge>
//               </div>
//             </div>
//           </CardContent>
//         </div>
//       </div>
//     </Card>






// // <Card>
// //   <CardHeader>
// //     <CardTitle>Welcome</CardTitle>
// //     <CardDescription>This is a styled card.</CardDescription>
// //   </CardHeader>
// //   <CardContent>
// //     <p>Here is the content of the card.</p>
// //   </CardContent>
// //   <CardFooter>
// //     <button>OK</button>
// //   </CardFooter>
// // </Card>




//   );
// };

// // Back button component with animation
// const BackButton = ({ onClick }) => (
//   <Button
//     variant="outline"
//     className="mb-5 pl-3 group flex items-center transition-all border-blue-100 hover:border-blue-200 hover:bg-blue-50"
//     onClick={onClick}
//   >
//     <ArrowLeft className="mr-2 h-4 w-4 text-blue-500 group-hover:-translate-x-1 transition-transform" />
//     <span className="font-medium text-gray-700">Back to Records</span>
//   </Button>
// );

// export default LabReportDetail;















// // src/app/labreport/[id]/page.js
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { useParams } from "next/navigation";

// /**
//  * Card that renders one HealthCategory + its analysis details.
//  */
// function HealthCategoryCard({ group }) {
//   const { HealthCategory, Analysis } = group;
//   const score = Analysis["Health Score"] ?? Analysis.HealthScore;

//   // Handle the API’s various key names for findings
//   const summary = Analysis.Summary || {};
//   const keyLines =
//     summary.KeyFindings || summary.Key_Observations || summary["Key Findings"] || [];

//   return (
//     <Card className="shadow-lg rounded-2xl">
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between gap-2 text-lg md:text-xl">
//           {HealthCategory.name}
//           {score !== undefined && (
//             <Badge variant="outline" className="px-2 py-1 text-xs">
//               {score}
//             </Badge>
//           )}
//         </CardTitle>
//         {summary.Overview && (
//           <CardDescription
//             dangerouslySetInnerHTML={{ __html: String(summary.Overview) }}
//           />
//         )}
//       </CardHeader>
//       <CardContent className="space-y-3">
//         {/* KEY FINDINGS */}
//         {keyLines.map((line, idx) => (
//           <p
//             key={idx}
//             className="text-sm leading-relaxed"
//             dangerouslySetInnerHTML={{ __html: line }}
//           />
//         ))}

//         {/* RECOMMENDATIONS */}
//         {Analysis.Recommendations && (
//           <section className="border-t pt-4 space-y-4">
//             <h4 className="font-semibold text-base">Recommendations</h4>
//             {Object.entries(Analysis.Recommendations).map(([section, items]) => (
//               <div key={section} className="space-y-1">
//                 <h5 className="text-xs uppercase tracking-wide text-muted-foreground">
//                   {section.replaceAll("_", " ")}
//                 </h5>
//                 <ul className="list-disc ml-5 text-sm space-y-0.5">
//                   {items.map((item, index) => (
//                     <li
//                       key={index}
//                       dangerouslySetInnerHTML={{ __html: item }}
//                     />
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </section>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// /**
//  * Main Lab Report Page
//  * Route: /labreport/[id]
//  */
// export default function LabReportPage() {
//   const params = useParams();
//   const reportId = params?.id ?? "3"; // default for dev/testing

//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Hit the proxy route – keeps cookies in same‑site context
//   const reportUrl = `/api/proxy/labreport/${reportId}?byTestGroup=True`;

//   useEffect(() => {
//     fetch(reportUrl, { credentials: "include" })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch lab report");
//         return res.json();
//       })
//       .then(setReport)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [reportUrl]);

//   if (loading) {
//     return <p className="p-8 text-center">Loading lab report…</p>;
//   }
//   if (error) {
//     return (
//       <p className="p-8 text-center text-destructive font-semibold">{error}</p>
//     );
//   }
//   if (!report) {
//     return null;
//   }

//   return (
//     <div className="container mx-auto p-6 space-y-8">
//       {/* PAGE HEADER */}
//       <header className="space-y-2 text-center md:text-left">
//         <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
//           Lab Report <span className="text-muted-foreground">#{report.reference_number}</span>
//         </h1>
//         <p className="text-sm text-muted-foreground">
//           {new Date(report.report_date).toLocaleDateString(undefined, {
//             year: "numeric",
//             month: "long",
//             day: "numeric",
//           })}
//         </p>
//       </header>

//       {/* HEALTH CATEGORY CARDS */}
//       <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {report.TestResultsByHealthGroup.map((group) => (
//           <HealthCategoryCard key={group.HealthCategory.id} group={group} />
//         ))}
//       </section>
//     </div>
//   );
// }





// // src/app/labreport/[id]/page.js
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";
// import { CalendarDays, Building2, Info } from "lucide-react";

// /************************************
//  *  SMALL UI HELPERS
//  ***********************************/
// function ValueBadge({ status }) {
//   const color =
//     status === "Normal"
//       ? "bg-green-100 text-green-800"
//       : status === "Borderline High" || status === "Borderline Low"
//       ? "bg-yellow-100 text-yellow-800"
//       : "bg-red-100 text-red-800";
//   return (
//     <span
//       className={`rounded-md px-2 py-0.5 text-xs font-medium ${color} whitespace-nowrap`}
//     >
//       {status}
//     </span>
//   );
// }

// function formatDate(dateStr) {
//   return new Date(dateStr).toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

// /************************************
//  *  TOP SUMMARY CARD
//  ***********************************/
// function ReportSummary({ report }) {
//   const {
//     Lab: { name: labName, Address },
//     reference_number,
//     report_date,
//   } = report;

//   return (
//     <Card className="w-full max-w-xl mx-auto mb-8 shadow-lg rounded-2xl overflow-hidden">
//       <div className="bg-blue-600 p-6 text-white">
//         <h2 className="text-xl font-semibold">Health Report</h2>
//         <p className="text-sm opacity-90">{labName}</p>
//       </div>
//       <CardContent className="p-6 space-y-4">
//         <div className="flex justify-between text-sm">
//           <div className="flex items-center gap-2">
//             <CalendarDays className="w-4 h-4 text-muted-foreground" />
//             <div>
//               <p className="font-medium text-muted-foreground">Report Date</p>
//               <p>{formatDate(report_date)}</p>
//             </div>
//           </div>
//           <div className="text-right">
//             <p className="font-medium text-muted-foreground">Ref Number</p>
//             <p className="font-semibold">{reference_number}</p>
//           </div>
//         </div>

//         <div className="flex items-start gap-3 pt-2 border-t">
//           <Building2 className="w-5 h-5 mt-1 text-muted-foreground" />
//           <div className="text-sm leading-relaxed">
//             <p className="font-semibold">{labName}</p>
//             <p className="text-muted-foreground">
//               {Address.street}, {Address.city} {Address.zip_code}
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /************************************
//  *  TEST RESULT TILE (inside accordion)
//  ***********************************/
// function TestTile({ test }) {
//   const {
//     LabTest: { name, units },
//     result_value,
//     RefRanges,
//   } = test;

//   // pick first non-empty interpretation matching the value range
//   const interpObj = useMemo(() => {
//     return (
//       RefRanges.find((r) => {
//         const low = parseFloat(r.low);
//         const high = parseFloat(r.high);
//         const val = parseFloat(result_value);
//         if (!isNaN(low) && !isNaN(high) && low === 0 && high === 0) {
//           return false; // ignore special “>7.0” style rows
//         }
//         return val >= low && val <= high;
//       }) || { interpretation: "-" }
//     );
//   }, [RefRanges, result_value]);

//   return (
//     <div className="border rounded-xl p-4 space-y-1">
//       <div className="flex items-center justify-between">
//         <h4 className="font-medium">{name}</h4>
//         <Info className="w-4 h-4 opacity-50" />
//       </div>
//       <div className="flex items-center gap-2 text-lg font-bold">
//         {parseFloat(result_value).toFixed(2)}
//         <span className="text-sm font-normal text-muted-foreground">{units}</span>
//       </div>
//       <div className="flex items-center justify-between text-xs mt-1">
//         <p className="text-muted-foreground">
//           Reference range: {RefRanges[0].low} - {RefRanges[0].high} {units}
//         </p>
//         {interpObj.interpretation && <ValueBadge status={interpObj.interpretation} />}
//       </div>
//     </div>
//   );
// }

// /************************************
//  *  HEALTH CATEGORY ACCORDION ITEM
//  ***********************************/
// function HealthCategoryItem({ group, defaultOpen = false }) {
//   const { HealthCategory, Analysis, TestResults } = group;
//   const score = Analysis["Health Score"] ?? Analysis.HealthScore;

//   // deduplicate tests by (LabTest.id + result_value) to avoid duplicates in sample data
//   const uniqueTests = useMemo(() => {
//     const seen = new Set();
//     return TestResults.filter((t) => {
//       const key = `${t.LabTest.id}-${t.result_value}`;
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });
//   }, [TestResults]);

//   return (
//     <AccordionItem value={String(HealthCategory.id)} className="border rounded-2xl">
//       <AccordionTrigger className="flex justify-between items-start p-4 gap-4">
//         <div>
//           <p className="font-medium leading-snug">{HealthCategory.name}</p>
//           <p className="text-muted-foreground text-sm">
//             {HealthCategory.description}
//           </p>
//         </div>
//         <Badge variant="outline" className="shrink-0 mt-1">
//           Score: {score}
//         </Badge>
//       </AccordionTrigger>
//       <AccordionContent className="p-4 space-y-4 bg-muted/50">
//         {uniqueTests.map((test) => (
//           <TestTile key={test.id} test={test} />
//         ))}
//       </AccordionContent>
//     </AccordionItem>
//   );
// }

// /************************************
//  *  MAIN PAGE COMPONENT
//  ***********************************/
// export default function LabReportPage() {
//   const params = useParams();
//   const reportId = params?.id ?? "3";

//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const reportUrl = `/api/proxy/labreport/${reportId}?byTestGroup=True`;

//   useEffect(() => {
//     fetch(reportUrl, { credentials: "include" })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch lab report");
//         return res.json();
//       })
//       .then(setReport)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [reportUrl]);

//   if (loading) return <p className="p-8 text-center">Loading lab report…</p>;
//   if (error)
//     return (
//       <p className="p-8 text-center text-destructive font-semibold">{error}</p>
//     );
//   if (!report) return null;

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-8">
//       {/* Back link */}
//       <a href="/records" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:underline">
//         ← Back to Records
//       </a>

//       {/* SUMMARY */}
//       <ReportSummary report={report} />

//       {/* CATEGORIES */}
//       <section>
//         <h3 className="font-semibold text-lg mb-4">
//           Health Categories ({report.TestResultsByHealthGroup.length})
//         </h3>
//         <Accordion type="single" collapsible defaultValue={String(report.TestResultsByHealthGroup[0]?.HealthCategory.id)} className="space-y-4">
//           {report.TestResultsByHealthGroup.map((group) => (
//             <HealthCategoryItem key={group.HealthCategory.id} group={group} />
//           ))}
//         </Accordion>
//       </section>
//     </div>
//   );
// }








// // src/app/labreport/[id]/page.js
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "next/navigation";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import {
//   Accordion,
//   AccordionItem,
//   AccordionTrigger,
//   AccordionContent,
// } from "@/components/ui/accordion";
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipTrigger,
//   TooltipContent,
// } from "@/components/ui/tooltip";
// import { CalendarDays, Building2, Info } from "lucide-react";

// /************************************
//  *  SMALL UI HELPERS
//  ***********************************/
// function ValueBadge({ status }) {
//   const color =
//     status === "Normal"
//       ? "bg-green-100 text-green-800"
//       : status === "Borderline High" || status === "Borderline Low"
//       ? "bg-yellow-100 text-yellow-800"
//       : "bg-red-100 text-red-800";
//   return (
//     <span
//       className={`rounded-md px-2 py-0.5 text-xs font-medium ${color} whitespace-nowrap`}
//     >
//       {status}
//     </span>
//   );
// }

// const formatDate = (dateStr) =>
//   new Date(dateStr).toLocaleDateString(undefined, {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

// /************************************
//  *  TOP SUMMARY CARD — unchanged
//  ***********************************/
// function ReportSummary({ report }) {
//   const {
//     Lab: { name: labName, Address },
//     reference_number,
//     report_date,
//   } = report;

//   return (
//     <Card className="w-full sm:max-w-xl mx-auto mb-6 sm:mb-8 shadow-lg rounded-2xl overflow-hidden">
//       <div className="bg-blue-600 p-4 sm:p-6 text-white">
//         <h2 className="text-lg sm:text-xl font-semibold">Health Report</h2>
//         <p className="text-xs sm:text-sm opacity-90">{labName}</p>
//       </div>
//       <CardContent className="p-4 sm:p-6 space-y-4">
//         <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-3">
//           <div className="flex items-center gap-2">
//             <CalendarDays className="w-4 h-4 text-muted-foreground" />
//             <div>
//               <p className="font-medium text-muted-foreground">Report Date</p>
//               <p>{formatDate(report_date)}</p>
//             </div>
//           </div>
//           <div className="text-left sm:text-right">
//             <p className="font-medium text-muted-foreground">Ref Number</p>
//             <p className="font-semibold break-all">{reference_number}</p>
//           </div>
//         </div>

//         <div className="flex items-start gap-3 pt-3 border-t">
//           <Building2 className="w-5 h-5 mt-0.5 text-muted-foreground" />
//           <div className="text-xs sm:text-sm leading-relaxed">
//             <p className="font-semibold">{labName}</p>
//             <p className="text-muted-foreground">
//               {Address.street}, {Address.city} {Address.zip_code}
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// /************************************
//  *  TEST RESULT TILE — now with tooltip
//  ***********************************/
// function TestTile({ test }) {
//   const {
//     LabTest: { name, units, long_description, short_description },
//     result_value,
//     RefRanges,
//   } = test;

//   const interpObj = useMemo(() => {
//     return (
//       RefRanges.find((r) => {
//         const low = parseFloat(r.low);
//         const high = parseFloat(r.high);
//         const val = parseFloat(result_value);
//         if (!isNaN(low) && !isNaN(high) && low === 0 && high === 0) return false;
//         return val >= low && val <= high;
//       }) || { interpretation: "-" }
//     );
//   }, [RefRanges, result_value]);

//   const desc = long_description || short_description || "No description available.";

//   return (
//     <div className="border rounded-xl p-3 sm:p-4 space-y-1 bg-white">
//       <div className="flex items-center justify-between">
//         <h4 className="font-medium text-sm sm:text-base leading-tight">
//           {name}
//         </h4>
//         <TooltipProvider delayDuration={300}>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <button aria-label="Info" className="text-muted-foreground">
//                 <Info className="w-4 h-4" />
//               </button>
//             </TooltipTrigger>
//             <TooltipContent className="max-w-xs text-xs sm:text-sm">
//               {desc}
//             </TooltipContent>
//           </Tooltip>
//         </TooltipProvider>
//       </div>
//       <div className="flex items-baseline gap-2">
//         <span className="text-lg sm:text-xl font-bold">
//           {parseFloat(result_value).toFixed(2)}
//         </span>
//         <span className="text-xs sm:text-sm text-muted-foreground">{units}</span>
//       </div>
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-[10px] sm:text-xs mt-1 gap-1">
//         <p className="text-muted-foreground">
//           Ref: {RefRanges[0].low} - {RefRanges[0].high} {units}
//         </p>
//         {interpObj.interpretation && <ValueBadge status={interpObj.interpretation} />}
//       </div>
//     </div>
//   );
// }

// /************************************
//  *  HEALTH CATEGORY ACCORDION ITEM — unchanged
//  ***********************************/
// function HealthCategoryItem({ group }) {
//   const { HealthCategory, Analysis, TestResults } = group;
//   const score = Analysis["Health Score"] ?? Analysis.HealthScore;

//   const uniqueTests = useMemo(() => {
//     const seen = new Set();
//     return TestResults.filter((t) => {
//       const key = `${t.LabTest.id}-${t.result_value}`;
//       if (seen.has(key)) return false;
//       seen.add(key);
//       return true;
//     });
//   }, [TestResults]);

//   return (
//     <AccordionItem value={String(HealthCategory.id)} className="border rounded-2xl bg-white">
//       <AccordionTrigger className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-start p-3 sm:p-4 w-full text-left">
//         <div className="space-y-0.5">
//           <p className="font-medium leading-snug text-sm sm:text-base">
//             {HealthCategory.name}
//           </p>
//           <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">
//             {HealthCategory.description}
//           </p>
//         </div>
//         <Badge variant="outline" className="mt-1 sm:mt-0 self-start sm:self-center">
//           Score: {score}
//         </Badge>
//       </AccordionTrigger>
//       <AccordionContent className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-muted/50">
//         {uniqueTests.map((test) => (
//           <TestTile key={test.id} test={test} />
//         ))}
//       </AccordionContent>
//     </AccordionItem>
//   );
// }

// /************************************
//  *  MAIN PAGE COMPONENT — unchanged except tooltip provider not needed globally now
//  ***********************************/
// export default function LabReportPage() {
//   const { id } = useParams();
//   const reportId = id ?? "3";

//   const [report, setReport] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const reportUrl = `/api/proxy/labreport/${reportId}?byTestGroup=True`;

//   useEffect(() => {
//     fetch(reportUrl, { credentials: "include" })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch lab report");
//         return res.json();
//       })
//       .then(setReport)
//       .catch((err) => setError(err.message))
//       .finally(() => setLoading(false));
//   }, [reportUrl]);

//   if (loading) return <p className="p-8 text-center">Loading lab report…</p>;
//   if (error)
//     return <p className="p-8 text-center text-destructive font-semibold">{error}</p>;
//   if (!report) return null;

//   return (
//     <div className="container mx-auto px-3 sm:px-4 md:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
//       <a
//         href="/records"
//         className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:underline"
//       >
//         ← Back to Records
//       </a>

//       <ReportSummary report={report} />

//       <section>
//         <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
//           Health Categories ({report.TestResultsByHealthGroup.length})
//         </h3>
//         <Accordion
//           type="single"
//           collapsible
//           defaultValue={String(report.TestResultsByHealthGroup[0]?.HealthCategory.id)}
//           className="space-y-3 sm:space-y-4"
//         >
//           {report.TestResultsByHealthGroup.map((group) => (
//             <HealthCategoryItem key={group.HealthCategory.id} group={group} />
//           ))}
//         </Accordion>
//       </section>
//     </div>
//   );
// }







// src/app/labreport/[id]/page.js
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CalendarDays, Building2, Info, ArrowLeft , Printer  } from "lucide-react";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";


/************************************
 *  SMALL UI HELPERS
 ***********************************/
function ValueBadge({ status }) {
  const color =
    status === "Normal"
      ? "bg-green-100 text-green-800"
      : status?.toLowerCase().includes("borderline")
      ? "bg-yellow-100 text-yellow-800"
      : "bg-red-100 text-red-800";
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${color}`}>{status}</span>
  );
}

const formatDate = (d) =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

/************************************
 *  TOP SUMMARY CARD
 ***********************************/
// function ReportSummary({ report }) {
//   const {
//     Lab: { name, Address },
//     reference_number,
//     report_date,
//   } = report;

//   return (
//     <Card className="w-full sm:max-w-xl mx-auto mb-6 sm:mb-8 shadow-lg rounded-2xl overflow-hidden">

      
//       <div className="bg-blue-600 p-4 sm:p-6 text-white">
//         <h2 className="text-lg sm:text-xl font-semibold">Health Report</h2>
//         <p className="text-xs sm:text-sm opacity-90">{name}</p>
//       </div>
//       <CardContent className="p-4 sm:p-6 space-y-4">
//         <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-3">
//           <div className="flex items-center gap-2">
//             <CalendarDays className="w-4 h-4 text-muted-foreground" />
//             <div>
//               <p className="font-medium text-muted-foreground">Report Date</p>
//               <p>{formatDate(report_date)}</p>
//             </div>
//           </div>
//           <div className="text-left sm:text-right">
//             <p className="font-medium text-muted-foreground">Ref Number</p>
//             <p className="font-semibold break-all">{reference_number}</p>
//           </div>
//         </div>

//         <div className="flex items-start gap-3 pt-3 border-t">
//           <Building2 className="w-5 h-5 mt-0.5 text-muted-foreground" />
//           <div className="text-xs sm:text-sm leading-relaxed">
//             <p className="font-semibold">{name}</p>
//             <p className="text-muted-foreground">
//               {Address.street}, {Address.city} {Address.zip_code}
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

function ReportSummary({ report }) {
  const {
    Lab: { name, Address },
    reference_number,
    report_date,
  } = report;

  return (
    <Card className="w-full sm:max-w-xl mx-auto mb-6 sm:mb-8 shadow-lg rounded-2xl overflow-hidden">
      {/* ▶ blue header with back‑pill */}
      <div className="bg-blue-600 px-4 sm:px-6 py-4 sm:py-5 text-white flex items-center gap-3">
        {/* Back link */}
        <Link
          href="/records"
          className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30
                     rounded-md px-2.5 py-1 text-xs sm:text-sm font-medium
                     transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </Link>

        {/* Title + lab name */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold leading-tight">
            Health Report
          </h2>
          <p className="text-xs sm:text-sm opacity-90">{name}</p>
        </div>
      </div>

      {/* ▾ existing content unchanged */}
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm gap-3">
          <div className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-muted-foreground">Report Date</p>
              <p>{formatDate(report_date)}</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="font-medium text-muted-foreground">Ref Number</p>
            <p className="font-semibold break-all">{reference_number}</p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3 border-t">
          <Building2 className="w-5 h-5 mt-0.5 text-muted-foreground" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <p className="font-semibold">{name}</p>
            <p className="text-muted-foreground">
              {Address.street}, {Address.city} {Address.zip_code}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



/************************************
 *  FLIP‑CARD for each test result
 ***********************************/

function FlipCard({ front, back }) {
  return (
    <div className="relative w-full sm:w-64 h-56 [perspective:1000px]">

      {/* Add group wrapper ONLY around icon + 3D scene */}
      <div className="group relative h-full w-full">

        {/* Flip trigger icon — this is what you hover over */}
        <div className="absolute top-1 right-1 z-30 cursor-pointer">
        <FontAwesomeIcon
  icon={faRepeat}
  className="text-muted-foreground text-lg transition-transform duration-300 group-hover:scale-110"
/>


 </div>


        {/* 3D scene that flips on icon hover only */}
        <div className="relative h-full w-full transition-transform duration-800 ease-in-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

          {/* Front face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center [transform:rotateY(0deg)] [backface-visibility:hidden] z-10">
            {front}
          </div>

          {/* Back face */}
          <div className="absolute inset-0 flex flex-col items-center justify-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
            {back}
          </div>

        </div>
      </div>
    </div>
  );
}



function TestTile({ test }) {
  const {
    LabTest: { name, units, long_description, short_description },
    result_value,
    RefRanges,
  } = test;

  const low  = RefRanges[0].low;
  const high = RefRanges[0].high;


 // ← Restore the full useMemo
  const interp = useMemo(() => {
    const val = parseFloat(result_value);
    const match = RefRanges.find(r => {
      const low  = parseFloat(r.low);
      const high = parseFloat(r.high);
      return val >= low && val <= high;
    });
    return match?.interpretation || "-";
  }, [RefRanges, result_value]);

  const front = (
    <div className="h-full w-full border rounded-xl p-3 sm:p-4 flex flex-col justify-between bg-white">
      <div className="space-y-1">
        <h4 className="font-medium text-sm sm:text-base leading-tight">{name}</h4>
  
        <div className="flex items-baseline gap-2">
          <span className="text-lg sm:text-xl font-bold">
            {parseFloat(result_value).toFixed(2)}
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground">{units}</span>
        </div>
  
        <p className="text-[10px] sm:text-xs text-muted-foreground">
          Ref: {low} – {high} {units}
        </p>
      </div>
  
      <div className="self-end mt-2">
        <ValueBadge status={interp} />
      </div>
    </div>
  );
  
  const back = (
    <div className="h-full w-full border rounded-xl px-4 pt-10 pb-4 flex flex-col items-start bg-white">
      
      {/* Description area */}
      <div className="text-sm sm:text-base leading-relaxed max-h-24 overflow-y-auto w-full pr-2">
        {long_description || short_description || "No description available."}
      </div>
  
      {/* Observed value and reference range */}
      <div className="mt-auto pt-4 space-y-2 w-full text-sm sm:text-base text-muted-foreground">
        <div className="flex gap-1 items-baseline">
          <span className="font-medium text-xs sm:text-sm">Observed:</span>
          <span className="text-lg sm:text-xl font-bold text-black">
            {parseFloat(result_value).toFixed(2)} {units}
          </span>
        </div>
        <div className="flex gap-1 items-baseline">
          <span className="font-medium text-xs sm:text-sm">Range:</span>
          <span className="text-base sm:text-lg font-semibold text-black">
            {low} – {high} {units}
          </span>
        </div>
      </div>
    </div>
  );
  

  return <FlipCard front={front} back={back} />;
}
/************************************
 *  HEALTH CATEGORY ITEM
 ***********************************/
function CategoryItem({ group }) {
  const { HealthCategory, Analysis, TestResults } = group;
  const score = Analysis["Health Score"] ?? Analysis.HealthScore;

  // dedup
  const tests = useMemo(() => {
    const seen = new Set();
    return TestResults.filter((t) => {
      const key = `${t.LabTest.id}-${t.result_value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [TestResults]);

  return (
    <AccordionItem value={String(HealthCategory.id)} className="border rounded-2xl bg-white">
      <AccordionTrigger className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-between items-start p-3 sm:p-4 text-left w-full">
        <div className="space-y-0.5">
          <p className="font-large text-sm sm:text-base leading-snug">{HealthCategory.name}</p>
          <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2">{HealthCategory.description}</p>
        </div>
        <Badge variant="outline" className="mt-1 sm:mt-0 self-start sm:self-center">Score: {score}</Badge>
      </AccordionTrigger>
      {/* <AccordionContent className="flex flex-col gap-4 bg-muted/50 p-3 sm:p-4"> */}
      <AccordionContent className="flex flex-wrap justify-center gap-4 bg-muted/50 p-3 sm:p-4">

        {tests.map((t) => (
          <TestTile key={t.id} test={t} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

/************************************
 *  MAIN PAGE COMPONENT
 ***********************************/
export default function LabReportPage() {
  const { id } = useParams();
  const reportId = id ?? "3";

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/proxy/labreport/${reportId}?byTestGroup=True`, { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject("Fetch error")))
      .then(setReport)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) return <p className="p-8 text-center">Loading…</p>;
  if (error) return <p className="p-8 text-center text-destructive font-semibold">{String(error)}</p>;
  if (!report) return null;

  return (
    <div className="container mx-auto px-3 md:px-8 py-4 sm:py-6 space-y-6 sm:space-y-8">
      <a href="/records" className="inline-flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:underline">← Back to Records</a>

      <ReportSummary report={report} />

      <section>
        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">Health Categories ({report.TestResultsByHealthGroup.length})</h3>
        <Accordion
          type="single"
          collapsible
          defaultValue={String(report.TestResultsByHealthGroup[0]?.HealthCategory.id)}
          className="space-y-3 sm:space-y-4"
        >
          {report.TestResultsByHealthGroup.map((g) => (
            <CategoryItem key={g.HealthCategory.id} group={g} />
          ))}
        </Accordion>

{/* ▾▾ ACTION BAR ▾▾ */}
<div
  className="
    flex flex-col sm:flex-row items-center justify-center
    gap-3 sm:gap-4
    mt-6 sm:mt-8
    mb-28
    pb-[env(safe-area-inset-bottom)]
    rounded-xl          /* keeps soft corners but no fill */
    shadow-none         /* remove wrapper shadow (optional) */
  "
>
  {/* Share */}
  <button
    type="button"
    onClick={() => alert('TODO: implement share!')}
    className="inline-flex items-center gap-2 rounded-lg
               bg-blue-600 hover:bg-blue-700
               px-4 py-2 text-sm sm:text-base font-medium text-white
               shadow transition"
  >
    <FontAwesomeIcon icon={faRepeat} className="w-4 h-4" />
    Share report
  </button>

  {/* Print */}
  <button
    type="button"
    onClick={() => window.print()}
    className="inline-flex items-center gap-2 rounded-lg
               bg-blue-600 hover:bg-blue-700
               px-4 py-2 text-sm sm:text-base font-medium text-white
               shadow transition"
  >
    <Printer className="w-4 h-4" />
    Print
  </button>
</div>
{/* ▴▴ END ACTION BAR ▴▴ */}


      </section>
    </div>
  );
}
