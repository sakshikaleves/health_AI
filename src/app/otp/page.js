"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

const countries = [
  {
    value: "us",
    label: "United States",
    code: "+1",
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
      >
        <rect width="24" height="12" fill="#B22234" />
        <rect y="12" width="24" height="12" fill="#FFFFFF" />
        <rect width="10" height="10" fill="#3C3B6E" />
      </svg>
    ),
  },
  {
    value: "in",
    label: "India",
    code: "+91",
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
      >
        <rect width="24" height="8" fill="#FF9933" />
        <rect y="8" width="24" height="8" fill="#FFFFFF" />
        <rect y="16" width="24" height="8" fill="#138808" />
        <circle cx="12" cy="12" r="3" fill="#000080" />
      </svg>
    ),
  },
  {
    value: "uk",
    label: "United Kingdom",
    code: "+44",
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="16"
        height="16"
        fill="none"
      >
        <rect width="24" height="24" fill="#00247D" />
        <path d="M0 0 L24 24 M24 0 L0 24" stroke="#FFFFFF" strokeWidth="4" />
        <path d="M12 0 V24 M0 12 H24" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M12 0 V24 M0 12 H24" stroke="#CF142B" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function AuthFlow() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("phone"); // "phone" or "otp"
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const router = useRouter();

  const selectedCountry = countries.find(
    (country) => country.code === countryCode
  );

  // Countdown Timer
  useEffect(() => {
    let interval;
    if (currentStep === "otp" && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, timer]);

  // Handle OTP Send
  const handleSendOTP = () => {
    if (phoneNumber.trim()) {
      setCurrentStep("otp");
      setTimer(30);
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      // Normally would verify with backend
      router.push("/login"); // Or wherever you want to go next
    }
  };

  // Handle Resend OTP
  const handleResendOTP = () => {
    setOtp("");
    setTimer(30);
    // Logic to resend OTP
  };

  // Mobile Number Entry UI
  if (currentStep === "phone") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#FAFAFA] px-4">
        <div className="flex flex-col items-center justify-around h-full max-w-md w-full">
          <div className="w-full">
            <button
              className="flex items-center mb-6 text-[18px] font-semibold text-black"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-5 w-5" /> Enter Mobile Number
            </button>

            {/* Phone Input Field */}
            <div className="flex items-center space-x-2 mb-8">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[100px] h-12 justify-between border border-gray-300 bg-[#F5F5F5] text-black"
                  >
                    {selectedCountry ? (
                      <div className="flex items-center">
                        <span className="mr-1">{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                      </div>
                    ) : (
                      "+1"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                      {countries.map((country) => (
                        <CommandItem
                          key={country.value}
                          value={country.label}
                          onSelect={() => {
                            setCountryCode(country.code);
                            setOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">{country.flag}</span>
                            <span>{country.label}</span>
                            <span className="ml-1 text-gray-500">
                              {country.code}
                            </span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              countryCode === country.code
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Input
                type="tel"
                placeholder="555-123-4567"
                className="flex-1 h-12 border border-gray-300 bg-[#F5F5F5] text-black px-4 text-lg placeholder-gray-500 focus:ring-0 focus:outline-none"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          {/* Send OTP Button */}
          <Button
            className="w-full rounded-lg flex items-center gap-2 bg-[#00796B] hover:bg-[#00796c] text-white"
            onClick={handleSendOTP}
            disabled={!phoneNumber.trim()}
          >
            Send OTP
          </Button>
        </div>
      </div>
    );
  }

  // OTP Verification UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FAFAFA] px-4">
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <button
          className="flex items-center mb-6 text-[18px] font-semibold text-black"
          onClick={() => setCurrentStep("phone")}
        >
          <ArrowLeft className="mr-2 h-5 w-5" /> OTP Verification
        </button>

        {/* OTP Instruction */}
        <p className="text-gray-700 text-[16px]">
          Enter the 6 digit OTP sent on{" "}
          <span className="font-bold">
            {countryCode} {phoneNumber}
          </span>{" "}
          to proceed
        </p>

        {/* OTP Input */}
        <Input
          type="text"
          maxLength={6}
          placeholder="000000"
          className="w-full h-12 mt-4 text-lg text-center border border-gray-300 bg-[#F5F5F5] focus:ring-0 focus:outline-none"
          value={otp}
          onChange={(e) => {
            // Only allow numbers
            const value = e.target.value.replace(/[^0-9]/g, "");
            setOtp(value);
          }}
        />

        {/* Countdown Timer */}
        <p className="mt-2 text-gray-600">
          Expire in <span className="font-semibold">{timer}s</span>
        </p>

        {/* Resend OTP */}
        <p className="mt-3 text-gray-600">
          Don&apos;t receive OTP?{" "}
          <button
            className={`font-semibold ${
              timer > 0 ? "text-gray-400" : "text-[#0F5D46]"
            }`}
            onClick={timer > 0 ? undefined : handleResendOTP}
            disabled={timer > 0}
          >
            Resend OTP
          </button>
        </p>

        {/* Verify OTP Button */}
        <Button
          className="w-full h-12 mt-8 bg-[#00796B] text-white text-lg font-medium rounded-lg hover:bg-[#00796c]"
          onClick={handleVerifyOTP}
          disabled={otp.length !== 6}
        >
          Verify OTP
        </Button>
      </div>
    </div>
  );
}
