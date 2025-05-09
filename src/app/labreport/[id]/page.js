



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
