"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  format,
  isWithinInterval,
  isSameMonth,
  isSameYear,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";

const RecordsPage = () => {
  const [selectedTab, setSelectedTab] = useState("prescription");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [date, setDate] = useState(new Date());
  const [filterView, setFilterView] = useState("day"); // 'day', 'month', 'year', 'custom'
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [dateRange, setDateRange] = useState({ from: startDate, to: endDate });
  const [filteredMedications, setFilteredMedications] = useState([]);

  const formatDateDisplay = () => {
    switch (filterView) {
      case "day":
        if (date.toDateString() === new Date().toDateString()) {
          return `${format(date, "dd/MM/yyyy")} (Today)`;
        }
        return format(date, "dd/MM/yyyy");
      case "month":
        return format(date, "MMMM yyyy");
      case "year":
        return format(date, "yyyy");
      case "custom":
        return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
          dateRange.to || dateRange.from,
          "dd/MM/yyyy"
        )}`;
      default:
        return format(date, "dd/MM/yyyy");
    }
  };

  const handlePrevMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCalendarMonth(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)
    );
  };

  const handleDateSelect = (newDate) => {
    setDate(newDate);
  };

  const handleApply = () => {
    if (filterView === "custom") {
      setStartDate(dateRange.from);
      setEndDate(dateRange.to || dateRange.from);
    } else if (filterView === "month") {
      setDate(new Date(date.getFullYear(), date.getMonth(), 1));
    } else if (filterView === "year") {
      setDate(new Date(date.getFullYear(), 0, 1));
    }
    setShowDateFilter(false);
  };

  // Enhanced dummy medications data with different dates
  const allMedications = [
    {
      name: "Cold and Flu Relief",
      date: new Date(2023, 5, 15),
      details: [
        { type: "pill", text: "Paracetamol 500 mg" },
        { type: "status", text: "Completed" },
      ],
    },
    {
      name: "Ibuprofen 200 mg",
      date: new Date(2023, 6, 20),
      details: [
        { type: "pill", text: "Levothyroxine (50 mcg)" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take before breakfast" },
      ],
    },
    {
      name: "Amoxicillin 500 mg",
      date: new Date(), // Today
      details: [
        { type: "pill", text: "Antibiotic" },
        { type: "status", text: "7-day course" },
        { type: "instruction", text: "Take 3 times daily with meals" },
      ],
    },
    {
      name: "Lisinopril 10 mg",
      date: new Date(2023, 4, 5),
      details: [
        { type: "pill", text: "Blood pressure medication" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take once daily" },
      ],
    },
    // Add more diverse dates and medications
    {
      name: "Simvastatin 20 mg",
      date: new Date(2023, 10, 12), // November 12, 2023
      details: [
        { type: "pill", text: "Cholesterol medication" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take in the evening" },
      ],
    },
    {
      name: "Metformin 500 mg",
      date: new Date(2023, 9, 5), // October 5, 2023
      details: [
        { type: "pill", text: "Diabetes medication" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take with meals" },
      ],
    },
    {
      name: "Loratadine 10 mg",
      date: new Date(2023, 3, 20), // April 20, 2023
      details: [
        { type: "pill", text: "Antihistamine" },
        { type: "status", text: "Seasonal" },
        { type: "instruction", text: "Take once daily for allergies" },
      ],
    },
    {
      name: "Ciprofloxacin 500 mg",
      date: new Date(2023, 2, 10), // March 10, 2023
      details: [
        { type: "pill", text: "Antibiotic" },
        { type: "status", text: "Completed" },
        { type: "instruction", text: "Take twice daily for 7 days" },
      ],
    },
    {
      name: "Sertraline 50 mg",
      date: new Date(2022, 11, 15), // December 15, 2022
      details: [
        { type: "pill", text: "Antidepressant" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take in the morning" },
      ],
    },
    {
      name: "Prednisone 10 mg",
      date: new Date(2022, 8, 5), // September 5, 2022
      details: [
        { type: "pill", text: "Corticosteroid" },
        { type: "status", text: "Completed" },
        { type: "instruction", text: "5-day tapering dose" },
      ],
    },
    {
      name: "Escitalopram 10 mg",
      date: new Date(2022, 6, 20), // July 20, 2022
      details: [
        { type: "pill", text: "Antidepressant" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take daily in the evening" },
      ],
    },
    // Yesterday's prescription
    {
      name: "Azithromycin 250 mg",
      date: new Date(new Date().setDate(new Date().getDate() - 1)),
      details: [
        { type: "pill", text: "Antibiotic" },
        { type: "status", text: "Active" },
        { type: "instruction", text: "Take for 5 days" },
      ],
    },
    // Last week prescription
    {
      name: "Omeprazole 20 mg",
      date: new Date(new Date().setDate(new Date().getDate() - 7)),
      details: [
        { type: "pill", text: "Acid reducer" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take before breakfast" },
      ],
    },
    // 3 days ago prescription
    {
      name: "Acetaminophen 650 mg",
      date: new Date(new Date().setDate(new Date().getDate() - 3)),
      details: [
        { type: "pill", text: "Pain reliever" },
        { type: "status", text: "As needed" },
        { type: "instruction", text: "Take every 6 hours if needed" },
      ],
    },
  ];

  // Safely check if a date is valid
  const isValidDate = (date) => {
    return (
      date &&
      date instanceof Date &&
      !isNaN(date) &&
      typeof date.toDateString === "function"
    );
  };

  // Filter medications based on current filter settings
  useEffect(() => {
    let filtered;
    const today = new Date();

    try {
      switch (filterView) {
        case "day":
          filtered = allMedications.filter((med) => {
            try {
              const medDate =
                med.date instanceof Date ? med.date : new Date(med.date);
              const compareDate = date instanceof Date ? date : new Date(date);
              return (
                isValidDate(medDate) &&
                isValidDate(compareDate) &&
                medDate.toDateString() === compareDate.toDateString()
              );
            } catch (e) {
              console.error("Error comparing dates:", e);
              return false;
            }
          });
          break;
        case "month":
          filtered = allMedications.filter((med) => {
            try {
              const medDate =
                med.date instanceof Date ? med.date : new Date(med.date);
              return (
                isValidDate(medDate) &&
                isSameMonth(medDate, date) &&
                isSameYear(medDate, date)
              );
            } catch (e) {
              console.error("Error comparing months:", e);
              return false;
            }
          });
          break;
        case "year":
          filtered = allMedications.filter((med) => {
            try {
              const medDate =
                med.date instanceof Date ? med.date : new Date(med.date);
              return isValidDate(medDate) && isSameYear(medDate, date);
            } catch (e) {
              console.error("Error comparing years:", e);
              return false;
            }
          });
          break;
        case "custom":
          const end = endDate || startDate;
          filtered = allMedications.filter((med) => {
            try {
              const medDate =
                med.date instanceof Date ? med.date : new Date(med.date);
              return (
                isValidDate(medDate) &&
                isWithinInterval(medDate, {
                  start:
                    startDate instanceof Date ? startDate : new Date(startDate),
                  end: end instanceof Date ? end : new Date(end),
                })
              );
            } catch (e) {
              console.error("Error comparing date range:", e);
              return false;
            }
          });
          break;
        default:
          filtered = allMedications.filter((med) => isValidDate(med.date));
      }
    } catch (e) {
      console.error("Error filtering medications:", e);
      filtered = [];
    }

    setFilteredMedications(filtered);
  }, [date, filterView, startDate, endDate]);

  // When filter view changes, reset appropriate date values
  useEffect(() => {
    if (filterView === "month") {
      // Keep the date but set to 1st of month
      setDate(new Date(date.getFullYear(), date.getMonth(), 1));
    } else if (filterView === "year") {
      // Keep the year but set to January 1st
      setDate(new Date(date.getFullYear(), 0, 1));
    } else if (filterView === "custom") {
      // Initialize custom range
      setDateRange({ from: startDate, to: endDate });
    }
  }, [filterView]);

  // Add summary information for filtered medications
  const getMedicationSummary = () => {
    if (filteredMedications.length === 0) return null;

    const activeCount = filteredMedications.filter((med) =>
      med.details.some(
        (d) =>
          d.type === "status" &&
          (d.text.includes("Ongoing") || d.text.includes("Active"))
      )
    ).length;

    const completedCount = filteredMedications.filter((med) =>
      med.details.some(
        (d) => d.type === "status" && d.text.includes("Completed")
      )
    ).length;

    const adherenceRate = Math.floor(70 + Math.random() * 30); // Random between 70-100%

    return { activeCount, completedCount, adherenceRate };
  };

  // Helper function to safely check Today and Yesterday
  const isSameDay = (date1, date2) => {
    try {
      const d1 = date1 instanceof Date ? date1 : new Date(date1);
      const d2 = date2 instanceof Date ? date2 : new Date(date2);
      return (
        isValidDate(d1) &&
        isValidDate(d2) &&
        d1.toDateString() === d2.toDateString()
      );
    } catch (e) {
      return false;
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 min-h-screen p-4">
      <h2 className="text-xl font-bold mb-1">Records</h2>
      <p className="text-sm text-gray-500 mb-4">Based on uploaded records.</p>

      {/* Tabs */}
      <Tabs
        defaultValue={selectedTab}
        className="mb-4"
        onValueChange={setSelectedTab}
      >
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger
            value="prescription"
            className={`rounded-full py-2 px-4 ${
              selectedTab === "prescription"
                ? "bg-teal-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Prescription
          </TabsTrigger>
          <TabsTrigger
            value="lab-report"
            className={`rounded-full py-2 px-4 ${
              selectedTab === "lab-report"
                ? "bg-teal-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Lab Report
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Date Selector */}
      <Popover open={showDateFilter} onOpenChange={setShowDateFilter}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between bg-white border rounded-md h-12 mb-4"
          >
            <span>{formatDateDisplay()}</span>
            <CalendarIcon className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="center">
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Date filter</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDateFilter(false)}
                >
                  <X size={18} />
                </Button>
              </div>

              {/* Filter options */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <Button
                  variant={filterView === "day" ? "default" : "outline"}
                  className={filterView === "day" ? "bg-black text-white" : ""}
                  onClick={() => setFilterView("day")}
                >
                  Day
                </Button>
                <Button
                  variant={filterView === "month" ? "default" : "outline"}
                  className={
                    filterView === "month" ? "bg-black text-white" : ""
                  }
                  onClick={() => setFilterView("month")}
                >
                  Month
                </Button>
                <Button
                  variant={filterView === "year" ? "default" : "outline"}
                  className={filterView === "year" ? "bg-black text-white" : ""}
                  onClick={() => setFilterView("year")}
                >
                  Year
                </Button>
                <Button
                  variant={filterView === "custom" ? "default" : "outline"}
                  className={
                    filterView === "custom" ? "bg-black text-white" : ""
                  }
                  onClick={() => setFilterView("custom")}
                >
                  Custom
                </Button>
              </div>

              {/* Calendar views based on filter selection */}
              {filterView === "day" && (
                <>
                  {/* Calendar header */}
                  <div className="flex justify-between items-center mb-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevMonth}
                    >
                      <ChevronLeft size={18} />
                    </Button>
                    <span className="font-medium">
                      {format(calendarMonth, "MMMM yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>

                  {/* Day Calendar */}
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    className="rounded-md border"
                    month={calendarMonth}
                    onMonthChange={setCalendarMonth}
                    disabled={(date) => date > new Date()}
                    modifiers={{
                      selected: date,
                      today: new Date(),
                    }}
                    modifiersClassNames={{
                      selected: "bg-teal-600 text-white",
                      today: "bg-gray-100",
                    }}
                    showOutsideDays={false}
                  />
                </>
              )}

              {filterView === "month" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setDate(
                          new Date(date.getFullYear(), date.getMonth() - 1, 1)
                        )
                      }
                    >
                      <ChevronLeft size={18} />
                    </Button>
                    <span className="font-medium text-lg">
                      {format(date, "yyyy")}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setDate(
                          new Date(date.getFullYear(), date.getMonth() + 1, 1)
                        )
                      }
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Button
                        key={i}
                        variant={date.getMonth() === i ? "default" : "outline"}
                        className={
                          date.getMonth() === i ? "bg-teal-600 text-white" : ""
                        }
                        onClick={() =>
                          setDate(new Date(date.getFullYear(), i, 1))
                        }
                      >
                        {format(new Date(0, i), "MMM")}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {filterView === "year" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setDate(new Date(date.getFullYear() - 1, 0, 1))
                      }
                    >
                      <ChevronLeft size={18} />
                    </Button>
                    <span className="font-medium text-lg">
                      {date.getFullYear() - 5} - {date.getFullYear() + 6}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setDate(new Date(date.getFullYear() + 1, 0, 1))
                      }
                    >
                      <ChevronRight size={18} />
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from(
                      { length: 12 },
                      (_, i) => date.getFullYear() - 5 + i
                    ).map((year) => (
                      <Button
                        key={year}
                        variant={
                          date.getFullYear() === year ? "default" : "outline"
                        }
                        className={
                          date.getFullYear() === year
                            ? "bg-teal-600 text-white"
                            : ""
                        }
                        onClick={() => setDate(new Date(year, 0, 1))}
                      >
                        {year}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {filterView === "custom" && (
                <div className="space-y-4">
                  <div className="mb-2">
                    <h4 className="font-medium mb-2">Select date range:</h4>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      className="rounded-md border"
                      numberOfMonths={2}
                      disabled={(date) => date > new Date()}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <div>
                      <p className="text-gray-500">Start:</p>
                      <p className="font-medium">
                        {dateRange.from
                          ? format(dateRange.from, "dd MMM yyyy")
                          : "Select"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">End:</p>
                      <p className="font-medium">
                        {dateRange.to
                          ? format(dateRange.to, "dd MMM yyyy")
                          : "Select"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Apply button */}
              <Button
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-md mt-4"
                onClick={handleApply}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Medication Records */}
      {selectedTab === "prescription" && (
        <div className="space-y-3">
          {filteredMedications.length > 0 ? (
            <>
              {/* Date range summary */}
              <div className="bg-white p-3 rounded-md shadow-sm">
                <div className="text-sm font-medium text-gray-500 mb-2">
                  {filterView === "day" && "Daily Summary"}
                  {filterView === "month" && "Monthly Summary"}
                  {filterView === "year" && "Yearly Summary"}
                  {filterView === "custom" && "Custom Range Summary"}
                </div>
                {(() => {
                  const summary = getMedicationSummary();
                  if (!summary) return null;

                  return (
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold">
                          {filteredMedications.length}
                        </div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">
                          {summary.activeCount}
                        </div>
                        <div className="text-xs text-gray-500">Active</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">
                          {summary.completedCount}
                        </div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {filteredMedications.map((medication, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="font-medium mb-2">{medication.name}</div>
                      <div className="text-xs text-gray-500">
                        {isValidDate(medication.date)
                          ? format(new Date(medication.date), "dd MMM yyyy")
                          : "No date"}
                        {isValidDate(medication.date) &&
                          isSameDay(medication.date, new Date()) &&
                          " (Today)"}
                        {isValidDate(medication.date) &&
                          isSameDay(
                            medication.date,
                            new Date(
                              new Date().setDate(new Date().getDate() - 1)
                            )
                          ) &&
                          " (Yesterday)"}
                      </div>
                    </div>
                    <div className="space-y-2">
                      {medication.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center">
                          <div
                            className={`p-2 rounded-md mr-3 ${
                              detail.type === "status" &&
                              detail.text.includes("Completed")
                                ? "bg-green-100"
                                : detail.type === "status" &&
                                  detail.text.includes("Active")
                                ? "bg-blue-100"
                                : "bg-gray-100"
                            }`}
                          >
                            <div className="w-5 h-5 flex items-center justify-center">
                              {detail.type === "pill" && <span>💊</span>}
                              {detail.type === "status" && <span>🔄</span>}
                              {detail.type === "instruction" && <span>📝</span>}
                            </div>
                          </div>
                          <div className="text-sm">{detail.text}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Medication Adherence */}
              <Card className="shadow-sm">
                <CardContent className="p-3">
                  <div className="font-medium mb-2">Medication Adherence</div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-md mr-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span>💊</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {getMedicationSummary()?.adherenceRate || 95}% Adherence
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-md mr-3">
                        <div className="w-5 h-5 flex items-center justify-center">
                          <span>🔄</span>
                        </div>
                      </div>
                      <div className="text-sm">
                        {getMedicationSummary()?.adherenceRate >= 90
                          ? "Excellent medication adherence"
                          : getMedicationSummary()?.adherenceRate >= 80
                          ? "Good medication adherence"
                          : "Ensure timely medication intake"}
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div
                        className={`h-2.5 rounded-full ${
                          (getMedicationSummary()?.adherenceRate || 95) >= 90
                            ? "bg-green-500"
                            : (getMedicationSummary()?.adherenceRate || 95) >=
                              80
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${
                            getMedicationSummary()?.adherenceRate || 95
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <p>
                No prescription records available for the selected time period.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lab Reports (Placeholder) */}
      {selectedTab === "lab-report" && (
        <div className="p-4 text-center text-gray-500">
          <p>No lab reports available for the selected date.</p>
        </div>
      )}
    </div>
  );
};

export default RecordsPage;
