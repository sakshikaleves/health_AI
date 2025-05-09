// "use client";
// // D:\New folder (2)\original_mahul\app-frontend\src\app\patients\page.jsx
// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Loader2, User } from "lucide-react";
// import { toast } from "sonner";

// export default function PatientsPage() {
//   const [defaultPatient, setDefaultPatient] = useState(null);
//   const [sharedPatients, setSharedPatients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPatients = async () => {
//       try {
//         const res = await fetch("/api/proxy/get_patients", {
//           credentials: "include",
//         });
//         const data = await res.json();

//         if (data.DefaultPatient) setDefaultPatient(data.DefaultPatient);
//         if (Array.isArray(data.SharedPatients)) setSharedPatients(data.SharedPatients);
//       } catch (err) {
//         console.error("Failed to fetch patients", err);
//         toast.error("Error loading patient data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatients();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-gray-600">
//         <Loader2 className="w-6 h-6 mr-2 animate-spin" />
//         Loading patients...
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <h1 className="text-xl font-semibold mb-4 text-gray-800">Your Patients</h1>

//       {/* Default Patient */}
//       {defaultPatient && (
//         <Card className="mb-6 border-blue-200">
//           <CardHeader>
//             <h2 className="text-lg font-semibold text-blue-700 flex items-center">
//               <User className="w-5 h-5 mr-2" /> Primary Patient
//             </h2>
//           </CardHeader>
//           <CardContent>
//             <PatientDetails patient={defaultPatient} />
//           </CardContent>
//         </Card>
//       )}

//       {/* Shared Patients */}
//       <h2 className="text-md font-semibold text-gray-700 mb-3">Shared With You</h2>
//       {sharedPatients.length === 0 ? (
//         <p className="text-sm text-gray-500">No shared patients found.</p>
//       ) : (
//         sharedPatients.map((p, idx) => (
//           <Card key={idx} className="mb-4 border-gray-200 shadow-sm">
//             <CardContent className="pt-4">
//               <PatientDetails patient={p} />
//             </CardContent>
//           </Card>
//         ))
//       )}
//     </div>
//   );
// }

// function PatientDetails({ patient }) {
//   return (
//     <div className="space-y-1 text-sm">
//       <p>
//         <span className="font-medium text-gray-700">Name:</span>{" "}
//         {patient.first_name} {patient.last_name}
//       </p>
//       <p>
//         <span className="font-medium text-gray-700">Phone:</span>{" "}
//         {patient.primary_phone}
//       </p>
//       <p>
//         <span className="font-medium text-gray-700">Gender:</span>{" "}
//         {patient.gender}
//       </p>
//       <p>
//         <span className="font-medium text-gray-700">Age:</span>{" "}
//         {patient.age}
//       </p>
//       <p>
//         <Badge variant="outline" className="mt-1">
//           ID: {patient.id}
//         </Badge>
//       </p>
//     </div>
//   );
// }






// D:\New folder (2)\original_mahul\app-frontend\src\app\patients\page.jsx
"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, User, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function PatientsPage() {
  const [defaultPatient, setDefaultPatient] = useState(null);
  const [sharedPatients, setSharedPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch("/api/proxy/share_patient", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.DefaultPatient) setDefaultPatient(data.DefaultPatient);
        if (Array.isArray(data.SharedPatients)) setSharedPatients(data.SharedPatients);
      } catch (err) {
        console.error("Failed to fetch patients", err);
        toast.error("Error loading patient data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
        Loading patients...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4 text-gray-800">Your Patients</h1>

      {defaultPatient && (
        <Card className="mb-6 border-blue-200">
          <CardHeader>
            <h2 className="text-lg font-semibold text-blue-700 flex items-center">
              <User className="w-5 h-5 mr-2" /> Primary Patient
            </h2>
          </CardHeader>
          <CardContent>
            <PatientDetails patient={defaultPatient} />
          </CardContent>
        </Card>
      )}

      <h2 className="text-md font-semibold text-gray-700 mb-3">Shared With You</h2>
      {sharedPatients.length === 0 ? (
        <p className="text-sm text-gray-500">No shared patients found.</p>
      ) : (
        sharedPatients.map((p, idx) => (
          <Card key={idx} className="mb-4 border-gray-200 shadow-sm">
            <CardContent className="pt-4">
              <PatientDetails patient={p} />
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

function PatientDetails({ patient }) {
  const [showShareInput, setShowShareInput] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sharing, setSharing] = useState(false);

  if (!patient) return null;

  const handleShare = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.warning("Please enter a valid phone number.");
      return;
    }
  
    setSharing(true);
    try {
      // Step 1: Set the active patient on the backend
      const setRes = await fetch(`/api/proxy/set_patient?id=${patient.id}`, {
        credentials: "include",
      });
  
      if (!setRes.ok) {
        throw new Error("Failed to set active patient before sharing");
      }
  
      // Step 2: Share the patient with provided phone number
      const res = await fetch("/api/proxy/share_patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          patient_id: patient.id,
          recipient_phone: phoneNumber,
        }),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to share");
  
      toast.success("Patient shared successfully!");
      setPhoneNumber("");
      setShowShareInput(false);
    } catch (err) {
      toast.error(err.message || "Error sharing patient");
      console.error("[SHARE_PATIENT] Error:", err);
    } finally {
      setSharing(false);
    }
  };
  

  return (
    <div className="space-y-1 text-sm">
      <div className="flex justify-between items-start">
        <div>
          <p><span className="font-medium">Name:</span> {patient.first_name} {patient.last_name}</p>
          <p><span className="font-medium">Phone:</span> {patient.primary_phone}</p>
          <p><span className="font-medium">Gender:</span> {patient.gender}</p>
          <p><span className="font-medium">Age:</span> {patient.age}</p>
          <p><Badge variant="outline">ID: {patient.id}</Badge></p>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="text-teal-600 hover:text-teal-800"
          onClick={() => setShowShareInput(!showShareInput)}
        >
          <Share className="w-4 h-4" />
        </Button>
      </div>

      {showShareInput && (
        <div className="flex items-center gap-2 mt-2">
          <Input
            placeholder="Phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button size="sm" onClick={handleShare} disabled={sharing}>
            {sharing ? "Sharing..." : "Share"}
          </Button>
        </div>
      )}
    </div>
  );
}
