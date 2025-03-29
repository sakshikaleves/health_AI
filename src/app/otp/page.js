"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { CountrySelector } from "@/components/ui/country-selector";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";

export default function MobileNumberEntry() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm">
        <button
          className="flex items-center mb-4 text-lg font-semibold text-black"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2" /> Enter Mobile Number
        </button>
        <div className="flex items-center space-x-2 mb-6">
          <CountrySelector value={countryCode} onChange={setCountryCode} />
          <Input
            type="tel"
            placeholder="555-123-4567"
            className="flex-1"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <Button className="w-full bg-green-700 text-white hover:bg-green-800">
          Send OTP
        </Button>
      </div>
    </div>
  );
}
