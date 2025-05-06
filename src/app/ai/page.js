"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatPanel } from "@/components/ui/ChatPanel";
import {
  AlertTriangle,
  CheckCircle,
  Send,
  Loader2,
  Bot,
  User,
} from "lucide-react";

export default function DashboardPage() {
  // const [tab, setTab] = useState('patients');
  // const [patients, setPatients] = useState([]);
  // const [prescriptions, setPrescriptions] = useState([]);
  // const [error, setError] = useState(null);

  return (
    <div>
      <main style={{ height: '100dvh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflow: 'hidden' }}>
          <ChatPanel />
        </div>
      </main>
    </div>
  );
}
