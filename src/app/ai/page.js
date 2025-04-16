"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Send,
  Loader2,
  Bot,
  User,
} from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function AIAssistant() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
        "You've consumed Grapefruit Juice for your lunch, which can intensify the effects of certain medications like Statins. If you are on one, it's always good to avoid grapefruit with medications that impact cholesterol.",
    },
  ];

  // Scroll to bottom when chat history updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Only updating the handleSubmit function to fix the API error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Add user message to chat
    const userMessage = { role: "user", content: query };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      // Initialize Gemini AI with the updated SDK approach
      const apiKey = "AIzaSyCMWq-SOASgDo0P7vYRvI7wKVY041vVRo0";
      const genAI = new GoogleGenerativeAI(apiKey);

      // Use the correct model name - "gemini-1.5-pro" or "gemini-1.0-pro"
      // instead of "gemini-pro"
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      // Health context for prompt
      const healthContext =
        "You are a medical assistant helping with medication information, interactions, and health advice. " +
        "Provide concise, accurate information. ";

      const fullPrompt = healthContext + query;
      let response;

      // Simplified approach to reduce potential errors
      try {
        const result = await model.generateContent(fullPrompt);
        response = result.response.text();
      } catch (modelError) {
        console.log("First model attempt failed, trying fallback model");

        // Fallback to older model version if needed
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-pro-1.0",
        });
        const fallbackResult = await fallbackModel.generateContent(fullPrompt);
        response = fallbackResult.response.text();
      }

      // Add AI response to chat
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error with Gemini API:", error);

      // More informative error message
      let errorMessage =
        "Sorry, I encountered an error connecting to the AI service.";

      if (error.message) {
        if (error.message.includes("API key")) {
          errorMessage = "API key error. Please check your configuration.";
        } else if (error.message.includes("network")) {
          errorMessage = "Network error. Please check your connection.";
        } else if (error.message.includes("not found")) {
          errorMessage =
            "The AI model isn't available right now. Please try again later.";
        } else if (error.message.includes("quota")) {
          errorMessage = "API usage limit reached. Please try again later.";
        }
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Rest of your component remains the same
  return (
    <div className="p-4 min-h-[80vh] max-w-lg mx-auto bg-gray-50 flex flex-col">
      <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-5 rounded-lg shadow-lg text-white mb-4">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5" /> AI Health Assistant
        </h1>
        <p className="text-sm text-teal-100 mt-1">
          Your personal guide to medication interactions and health information
        </p>
      </div>

      {/* Rest of your component remains unchanged */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {filters.map((filter) => (
          <Button
            key={filter}
            variant={selectedFilter === filter ? "default" : "outline"}
            onClick={() => setSelectedFilter(filter)}
            className={
              selectedFilter === filter ? "bg-teal-600 hover:bg-teal-700" : ""
            }
            size="sm"
          >
            {filter}
          </Button>
        ))}
      </div>

      {/* Notifications section */}
      <div className="space-y-3 mb-6">
        {notifications
          .filter(
            (n) =>
              selectedFilter === "All" ||
              (selectedFilter === "Medicine conflict" &&
                n.type === "warning") ||
              (selectedFilter === "Food conflict" && n.type === "danger")
          )
          .map((notif, index) => (
            <Card
              key={index}
              className={`border-l-4 shadow-sm hover:shadow transition-shadow ${
                notif.type === "danger"
                  ? "border-l-red-500"
                  : "border-l-yellow-500"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-3 items-start">
                  {notif.type === "danger" ? (
                    <AlertTriangle className="text-red-500 h-5 w-5 mt-0.5" />
                  ) : (
                    <CheckCircle className="text-yellow-500 h-5 w-5 mt-0.5" />
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

      {/* Chat history */}
      {chatHistory.length > 0 && (
        <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-3 bg-white">
          <div className="space-y-3">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-teal-600 text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {message.role === "user" ? (
                      <>
                        <User className="h-3 w-3" />{" "}
                        <span className="text-xs font-medium">You</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3" />{" "}
                        <span className="text-xs font-medium">
                          AI Assistant
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-100 text-gray-800 rounded-tl-none">
                  <div className="flex items-center gap-2">
                    <Bot className="h-3 w-3" />
                    <span className="text-xs font-medium">AI Assistant</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <div
                      className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-500 rounded-full animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="mt-auto">
        <div className="relative">
          <Input
            placeholder="Ask about medications, interactions, or health advice..."
            className="pr-12 shadow-sm border-gray-300 focus:border-teal-500 focus:ring focus:ring-teal-200 transition-all"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            size="sm"
            disabled={loading || !query.trim()}
            className="absolute right-1 top-1 h-8 bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Your health assistant uses AI to provide information. Always consult
          with a healthcare professional.
        </p>
      </form>
    </div>
  );
}
