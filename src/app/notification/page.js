"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Pill, FileText } from "lucide-react";

export default function Notifications() {
  const [taken, setTaken] = useState(false);

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      {/* Medication Reminder */}
      <div className="border rounded-lg p-4 shadow-md">
        <div className="flex items-center gap-2">
          <Pill className="text-teal-600" />
          <h3 className="font-semibold">Paracetamol 500 mg</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Wait Time Before Eating: 30-60 minutes after taking the pill. Take
          with Water: A full glass ensures better absorption.
        </p>
        <div className="mt-3 flex gap-2">
          <Button variant="outline">Snooze Reminder</Button>
          <Button
            onClick={() => setTaken(true)}
            className={taken ? "bg-teal-700 text-white" : ""}
          >
            {taken ? "Taken" : "Mark as Taken"}
          </Button>
        </div>
      </div>

      {/* Low Blood Sugar Alert */}
      <div className="border rounded-lg p-4 shadow-md bg-red-50">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle />
          <h3 className="font-semibold">Low Blood Sugar Alert</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Your <strong>blood sugar level</strong> is currently{" "}
          <strong>72 mg/dL</strong>, which is below the normal range. Please
          consume a<strong> fast-acting carbohydrate</strong> to raise your
          blood sugar levels.
        </p>
        <p className="mt-2 font-medium">Take Action: Drink Juice</p>
      </div>

      {/* Health Report Shared */}
      <div className="border rounded-lg p-4 shadow-md">
        <div className="flex items-center gap-2 text-green-600">
          <FileText />
          <h3 className="font-semibold">Health Report Shared</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Your Blood Test Report has been successfully shared with Dr. Mark
          Adams.
        </p>
      </div>
    </div>
  );
}
