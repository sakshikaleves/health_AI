"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, Search } from "lucide-react";

export default function AIAssistant() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const filters = ["All", "Medicine conflict", "Food conflict"];
  const notifications = [
    {
      type: "warning",
      title: "Risk of kidney issues",
      description:
        "Ibuprofen and Amlodipine have no direct interactions. However, combining these can sometimes increase the risk of kidney issues in the long run if taken regularly.",
    },
    {
      type: "danger",
      title: "Impact cholesterol",
      description:
        "You’ve consumed Grapefruit Juice for your lunch, which can intensify the effects of certain medications like Statins. If you are on one, it’s always good to avoid grapefruit with medications that impact cholesterol.",
    },
  ];

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold flex items-center gap-2">
        ✨ AI Assistant!
      </h1>
      <p className="text-sm text-gray-500">Lorem Ipsum</p>
      <div className="mt-4 flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </Button>
        ))}
      </div>
      <div className="mt-4 space-y-3">
        {notifications.map((notif, index) => (
          <Card
            key={index}
            className={`border ${
              notif.type === "danger" ? "border-red-500" : "border-yellow-500"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex gap-2 items-start">
                {notif.type === "danger" ? (
                  <AlertTriangle className="text-red-500" />
                ) : (
                  <CheckCircle className="text-yellow-500" />
                )}
                <div>
                  <h2 className="font-semibold">{notif.title}</h2>
                  <p className="text-sm text-gray-600">{notif.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-6 border-t pt-4">
        <Input
          placeholder="Ask Anything..."
          className="w-full"
          icon={<Search />}
        />
      </div>
    </div>
  );
}
