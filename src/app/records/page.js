"use client";

import React, { useState } from "react";
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
import { format } from "date-fns";

const RecordsPage = () => {
  const [selectedTab, setSelectedTab] = useState("prescription");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [date, setDate] = useState(new Date());
  const [filterView, setFilterView] = useState("day"); // 'day', 'month', 'year', 'custom'
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const formatDateDisplay = () => {
    if (date.toDateString() === new Date().toDateString()) {
      return `${format(date, "dd/MM/yyyy")} (Today)`;
    }
    return format(date, "dd/MM/yyyy");
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
    setShowDateFilter(false);
  };

  const medications = [
    {
      name: "Cold and Flu Relief",
      details: [
        { type: "pill", text: "Paracetamol 500 mg" },
        { type: "status", text: "Ongoing" },
      ],
    },
    {
      name: "Ibuprofen 200 mg",
      details: [
        { type: "pill", text: "Levothyroxine (50 mcg)" },
        { type: "status", text: "Ongoing" },
        { type: "instruction", text: "Take before breakfast" },
      ],
    },
  ];

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

              {/* Calendar header */}
              <div className="flex justify-between items-center mb-2">
                <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
                  <ChevronLeft size={18} />
                </Button>
                <span className="font-medium">
                  {format(calendarMonth, "MMMM yyyy")}
                </span>
                <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                  <ChevronRight size={18} />
                </Button>
              </div>

              {/* Calendar */}
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
          {medications.map((medication, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-3">
                <div className="font-medium mb-2">{medication.name}</div>
                <div className="space-y-2">
                  {medication.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-md mr-3">
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
                  <div className="text-sm font-medium">95% Adherence</div>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span>🔄</span>
                    </div>
                  </div>
                  <div className="text-sm">Ensure timely medication intake</div>
                </div>
              </div>
            </CardContent>
          </Card>
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
