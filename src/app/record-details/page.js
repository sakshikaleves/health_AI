// pages/medication/[id].js
import React from "react";
import { ChevronLeft, MoreVertical, FileText, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
// import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function MedicationDetail() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center border-b">
        <Button variant="ghost" size="icon" className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-medium flex-1">Cold and Flu Relief</h1>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 container max-w-md mx-auto pb-6">
        <div className="space-y-4 p-4">
          {/* Medication Summary */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-2 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h2 className="font-medium text-gray-900">
                    Paracetamol 500 mg
                  </h2>
                  <div className="mt-2">
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200 rounded-full"
                    >
                      Ongoing
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prescription Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between text-sm text-gray-500">
              <div>
                <p>Updated Date:</p>
                <p className="font-medium text-gray-900">12/03/2023</p>
              </div>
              <div className="text-right">
                <p>Prescribed By:</p>
                <p className="font-medium text-gray-900">Dr. Mark Adams</p>
              </div>
            </div>
          </div>

          {/* Associated Files */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Associated Files:</h3>
            <Card className="border border-gray-200">
              <CardHeader className="p-3 pb-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium">
                      QMH Synthetic Hospital
                    </CardTitle>
                    <CardDescription className="text-xs">
                      120 Medical St, Medical District
                      <br />
                      Tel: +1 (123) 456-7890
                    </CardDescription>
                  </div>
                  <Avatar className="h-10 w-10 bg-blue-100">
                    <svg
                      className="h-6 w-6 text-blue-500"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 2v4h8V2H8zm8 4v8h4V6h-4zm0 8h-8v4h8v-4zm-8 0V6H4v8h4z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Avatar>
                </div>
              </CardHeader>
              <CardContent className="p-3 pt-2">
                <div className="grid grid-cols-2 gap-1 text-xs mt-2">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p>2023-08-01 08:52</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Patient ID: MEDREC</p>
                    <p>A12-345-6789</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Age</p>
                    <p>27y 10m 3d</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sex</p>
                    <p>Female</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Doctor's Note */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-2">Doctor's Note</h3>
            <p className="text-gray-600">NA</p>
          </div>

          {/* Dosage Instructions */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Dosage Instructions:</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Paracetamol:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>500 mg every 4-6 hours as needed for pain and fever.</li>
                  <li>Max 4 doses per day.</li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Diphenhydramine:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>
                    25 mg before bed for relief of cold symptoms and to assist
                    with sleep.
                  </li>
                  <li>Take only at night.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* What This Medication Does */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">What This Medication Does:</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Paracetamol:</p>
                <p className="text-gray-600 mt-1">
                  Relieves pain and reduces fever by blocking chemicals in the
                  brain that cause pain and inflammation.
                </p>
              </div>
              <div>
                <p className="font-medium">Diphenhydramine:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>
                    A first-generation antihistamine. It helps reduce symptoms
                    such as runny nose, sneezing, cough, and itchy eyes.
                  </li>
                  <li>
                    Works as a sedative to help with sleep during nighttime.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Precautions & Warnings */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Precautions & Warnings:</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Paracetamol:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>Avoid alcohol to prevent liver damage.</li>
                  <li>Do not exceed 4000 mg of Paracetamol in 24 hours.</li>
                  <li>
                    If you have liver disease, consult your doctor before use.
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-medium">Diphenhydramine:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>
                    May cause drowsiness. Do not operate heavy machinery or
                    drive after taking this medication.
                  </li>
                  <li>
                    Not suitable for children under 6 years old unless
                    prescribed by a doctor.
                  </li>
                  <li>
                    Use with caution if you have a history of glaucoma or
                    urinary retention.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Common Side Effects */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-medium mb-3">Common Side Effects:</h3>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Paracetamol:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1 mt-1">
                  <li>
                    Rare side effects may include liver damage, especially with
                    overdose.
                  </li>
                  <li>
                    Allergic reactions such as rash or swelling (if any, seek
                    immediate medical attention).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
