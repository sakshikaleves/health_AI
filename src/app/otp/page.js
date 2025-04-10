"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { ArrowLeft, Check, ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
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
import { toast } from "sonner";
import { countries } from "@/data/Country";
import apiService from "@/services/api";

export default function AuthFlow() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState("phone"); // "phone" or "otp"
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { changeUser } = useUser();

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
  const handleSendOTP = async () => {
    if (phoneNumber.trim()) {
      try {
        setIsLoading(true);
        // Remove country code if it's in the phone number
        const cleanedPhoneNumber = phoneNumber.replace(/^\+\d+\s*/, "");
        console.log("Sending OTP to:", cleanedPhoneNumber);

        // Use the API service
        const data = await apiService.sendOTP(cleanedPhoneNumber);

        setCurrentStep("otp");
        setTimer(30);
        toast.success("OTP sent successfully");
        // For development, if API returns the OTP directly, autofill it
        if (data["use OTP"]) {
          setOtp(data["use OTP"]);
        }
      } catch (error) {
        console.error("Error sending OTP:", error);
        toast.error("Failed to send OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle OTP Verification
  const handleVerifyOTP = async () => {
    if (otp.length === 6 || otp.length === 4) {
      // Support both 4 and 6 digit OTPs
      try {
        setIsLoading(true);
        // Remove country code if it's in the phone number
        const cleanedPhoneNumber = phoneNumber.replace(/^\+\d+\s*/, "");

        // Use the API service
        const data = await apiService.verifyOTP(cleanedPhoneNumber, otp);

        // Update user context with authenticated state
        changeUser({
          isAuthenticated: true,
          sessionId: data.session_id,
          phone: cleanedPhoneNumber,
        });

        toast.success("Login successful");
        router.push("/dashboard"); // Navigate to dashboard or home
      } catch (error) {
        console.error("Error verifying OTP:", error);
        toast.error("Failed to verify OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Resend OTP
  const handleResendOTP = async () => {
    if (timer === 0) {
      try {
        setIsLoading(true);
        const cleanedPhoneNumber = phoneNumber.replace(/^\+\d+\s*/, "");

        // Use the API service
        const data = await apiService.sendOTP(cleanedPhoneNumber);

        setOtp("");
        setTimer(30);
        toast.success("OTP resent successfully");
        // For development, if API returns the OTP directly, autofill it
        if (data["use OTP"]) {
          setOtp(data["use OTP"]);
        }
      } catch (error) {
        console.error("Error resending OTP:", error);
        toast.error("Failed to resend OTP. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
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
            disabled={!phoneNumber.trim() || isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
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
          Didn&apos;t receive OTP?{" "}
          <button
            className={`font-semibold ${
              timer > 0 ? "text-gray-400" : "text-[#0F5D46]"}
            `}
            onClick={timer > 0 ? undefined : handleResendOTP}
            disabled={timer > 0 || isLoading}
          >
            Resend OTP
          </button>
        </p>

        {/* Verify OTP Button */}
        <Button
          className="w-full h-12 mt-8 bg-[#00796B] text-white text-lg font-medium rounded-lg hover:bg-[#00796c]"
          onClick={handleVerifyOTP}
          disabled={(otp.length !== 6 && otp.length !== 4) || isLoading}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </Button>
      </div>
    </div>
  );
}
