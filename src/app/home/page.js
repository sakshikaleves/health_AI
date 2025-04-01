"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, ChevronDown, X } from "lucide-react";

const HealthSummary = () => {
  const [expandedSections, setExpandedSections] = useState({
    thyroid: false,
    diabetes: false,
    bloodPressure: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="max-w-md mx-auto bg-slate-50 p-4 h-full">
      <h2 className="text-xl font-bold mb-1">Health Summary</h2>
      <p className="text-sm text-gray-500 mb-4">Based on uploaded records.</p>

      {/* Thyroid Section */}
      <Card className="mb-3 shadow-sm">
        <CardContent className="p-0">
          <div
            className="flex justify-between items-center p-3 cursor-pointer"
            onClick={() => toggleSection("thyroid")}
          >
            <h3 className="font-semibold">Thyroid Condition</h3>
            <div className="flex items-center">
              {expandedSections.thyroid ? (
                <span className="text-sm text-gray-400 mr-2">Close</span>
              ) : (
                <span className="text-sm text-teal-500 mr-2">3+ more</span>
              )}
              {expandedSections.thyroid ? (
                <X size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-teal-500" />
              )}
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="text-sm text-gray-500">Latest Report</div>
            <div className="flex items-center mt-1">
              <div className="bg-gray-100 p-2 rounded-md mr-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">📄</span>
                </div>
              </div>
              <div>
                <div className="font-medium">TSH 1.2 (Normal)</div>
                <div className="text-sm text-gray-500">Jun 15, 2025</div>
              </div>
            </div>
            <div className="flex items-center mt-3">
              <div className="bg-gray-100 p-2 rounded-md mr-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">👁️</span>
                </div>
              </div>
              <div className="text-sm">No Immediate Concern</div>
            </div>

            {expandedSections.thyroid && (
              <>
                <div className="mt-4 border-t pt-3">
                  <div className="text-sm text-gray-500">Previous Report</div>
                  <div className="flex items-center mt-1">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📄</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">
                        HbA1c: 6.1% (Pre-diabetes)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t pt-3">
                  <div className="text-sm text-gray-500">
                    Medication Summary
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">💊</span>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">Levothyroxine (50 mcg)</div>
                      <div className="text-sm text-gray-500">Ongoing</div>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">⏰</span>
                      </div>
                    </div>
                    <div className="text-sm">Take before breakfast</div>
                  </div>
                </div>

                <div className="mt-4 border-t pt-3">
                  <div className="text-sm text-gray-500">
                    Symptoms & History
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">🔍</span>
                      </div>
                    </div>
                    <div className="text-sm">Fatigue, weight gain, cold</div>
                  </div>
                  <div className="flex items-center mt-3">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📅</span>
                      </div>
                    </div>
                    <div className="text-sm">Jun 15, 2025</div>
                  </div>
                  <div className="flex items-center mt-3">
                    <div className="bg-gray-100 p-2 rounded-md mr-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <span className="text-gray-600 text-sm">📈</span>
                      </div>
                    </div>
                    <div className="text-sm">Improved over 6 months</div>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Type 2 Diabetes Section */}
      <Card className="mb-3 shadow-sm">
        <CardContent className="p-0">
          <div
            className="flex justify-between items-center p-3 cursor-pointer"
            onClick={() => toggleSection("diabetes")}
          >
            <h3 className="font-semibold">Type 2 Diabetes</h3>
            <div className="flex items-center">
              {expandedSections.diabetes ? (
                <span className="text-sm text-gray-400 mr-2">Close</span>
              ) : (
                <span className="text-sm text-teal-500 mr-2">3+ more</span>
              )}
              {expandedSections.diabetes ? (
                <X size={16} className="text-gray-400" />
              ) : (
                <ChevronRight size={16} className="text-teal-500" />
              )}
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="text-sm text-gray-500">
              Latest Blood Sugar Report
            </div>
            <div className="flex items-center mt-1">
              <div className="bg-gray-100 p-2 rounded-md mr-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">🔬</span>
                </div>
              </div>
              <div>
                <div className="font-medium">
                  {expandedSections.diabetes
                    ? "Fasting: 135 mg/dL (High)"
                    : "135 mg/dL (High)"}
                </div>
                <div className="text-sm text-gray-500">
                  {expandedSections.diabetes ? "Jan 20, 2025" : "Jun 15, 2025"}
                </div>
              </div>
            </div>

            {expandedSections.diabetes && (
              <div className="mt-4 border-t pt-3">
                <div className="text-sm text-gray-500">
                  Previous Blood Sugar Report
                </div>
                <div className="flex items-center mt-1">
                  <div className="bg-gray-100 p-2 rounded-md mr-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">🔬</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">Fasting: 135 mg/dL (High)</div>
                    <div className="text-sm text-gray-500">Jan 15, 2025</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Blood Pressure Section */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div
            className="flex justify-between items-center p-3 cursor-pointer"
            onClick={() => toggleSection("bloodPressure")}
          >
            <h3 className="font-semibold">Blood Pressure Monitoring</h3>
            <div className="flex items-center">
              <span className="text-sm text-teal-500 mr-2">2 more</span>
              <ChevronRight size={16} className="text-teal-500" />
            </div>
          </div>

          <div className="px-3 pb-3">
            <div className="text-sm text-gray-500">
              Latest Blood Pressure Report
            </div>
            <div className="flex items-center mt-1">
              <div className="bg-gray-100 p-2 rounded-md mr-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">🫀</span>
                </div>
              </div>
              <div>
                <div className="font-medium">130/85 mmHg (High)</div>
                <div className="text-sm text-gray-500">Jun 15, 2025</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthSummary;
