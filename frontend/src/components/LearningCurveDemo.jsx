import React, { useState } from 'react';
import { 
  TrendingUp, 
  Brain, 
  Sparkles, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Zap, 
  Award,
  Layers,
  Clock,
  ShieldCheck,
  Bot
} from 'lucide-react';

export default function LearningCurveDemo() {
  const [activeStep, setActiveStep] = useState(2); // 0: Int 1, 1: Int 5, 2: Int 20

  const steps = [
    {
      id: 0,
      stage: "Interaction 1",
      title: "New Customer (No Memory)",
      badge: "Generic Chatbot",
      badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
      customerQuery: "My payment is failing during monthly checkout renewal.",
      hindsightState: "Empty Memory Bank for Customer CUST_001. No prior context recorded.",
      recalledMemory: null,
      response: "Please check your payment method, verify your billing address, and clear your browser cache & cookies before trying again.",
      issueOutcome: "Customer tried clearing cache -> Failed. Customer had to explain their setup again.",
      timeToResolution: "45 minutes (Multiple iterations)",
      satisfaction: "2 / 5 ⭐ (Frustrated)"
    },
    {
      id: 1,
      stage: "Interaction 5",
      title: "Returning Customer (Short-Term Memory)",
      badge: "Personalized Support",
      badgeColor: "bg-indigo-950 text-indigo-300 border-indigo-700",
      customerQuery: "My payment is failing again.",
      hindsightState: "Recalled Memory #101: Customer previously tried clearing cache (Failed) and updating card zip code (Worked).",
      recalledMemory: {
        id: "Mem #101",
        failed: "Clear browser cache",
        working: "Update billing zip code & card details"
      },
      response: "Welcome back Alice! I recall you experienced a payment issue earlier. Last time, clearing browser cache failed, but updating your billing zip code resolved it.\n\nLet's skip cache resetting and check your billing zip code first.",
      issueOutcome: "Customer updated billing zip code -> Success on 1st attempt!",
      timeToResolution: "3 minutes",
      satisfaction: "4.8 / 5 ⭐ (Impressed)"
    },
    {
      id: 2,
      stage: "Interaction 20",
      title: "Experienced Customer Context (Deep Hindsight Memory)",
      badge: "Experience-Driven Expert",
      badgeColor: "bg-purple-950 text-purple-300 border-purple-500 glow-purple",
      customerQuery: "The payment issue happened again on checkout.",
      hindsightState: "Recalled Memory Bank (8 memories): Customer uses Web/Chrome 122 on Stripe Gateway. Past 4 failures were all tied to expired 3D Secure bank authorization tokens after monthly billing cycles.",
      recalledMemory: {
        id: "Mem Bank #101-#108",
        failed: "Browser cache, Zip update, Card re-entry",
        working: "Re-authorize 3D-Secure Token in Bank App"
      },
      response: "Hello Alice! I have analyzed your complete support history across your past 12 tickets. Since browser cache and card zip updates previously failed, and your account operates on Stripe Gateway with Chrome 122:\n\nRoot Cause: Your bank's 3D-Secure 30-day authorization token expired today. Please click the 1-click Bank Token Re-authorization link below.",
      issueOutcome: "Customer clicked 1-click re-authorize -> Instantly resolved!",
      timeToResolution: "30 seconds (Zero friction)",
      satisfaction: "5.0 / 5 ⭐ (Superfan)"
    }
  ];

  const current = steps[activeStep];

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 glow-purple">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Agent Learning Curve Simulator</h2>
              <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm">
                Hindsight Hackathon Core Value
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Demonstrating how persistent memory transforms generic AI into an experienced, domain-expert support partner over time.
            </p>
          </div>
        </div>
      </div>

      {/* 3-Stage Progress Timeline selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step) => {
          const isSelected = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-5 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between gap-3 ${
                isSelected 
                  ? 'bg-slate-900 border-purple-500 shadow-xl glow-purple' 
                  : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                  {step.stage}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-mono font-semibold ${step.badgeColor}`}>
                  {step.badge}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{step.hindsightState}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60 text-slate-400 font-mono text-[11px]">
                <span>CSAT: {step.satisfaction}</span>
                <span className="text-purple-300 font-semibold flex items-center gap-1">
                  View Demo <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Comparison Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="bg-purple-950 text-purple-300 border border-purple-500/40 text-xs px-3 py-1 rounded-full font-bold font-mono">
              {current.stage} — {current.badge}
            </span>
            <h3 className="text-base font-bold text-white">{current.title}</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Simulated Support Interaction</span>
        </div>

        {/* Customer Input Box */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Customer Query:
          </span>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm font-medium text-white">
            "{current.customerQuery}"
          </div>
        </div>

        {/* Hindsight Memory Recall Analysis */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5 text-purple-400 animate-pulse" /> Hindsight Memory Layer Analysis:
          </span>
          <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 p-4 rounded-xl border border-purple-500/40 space-y-3">
            <p className="text-xs text-purple-200 leading-relaxed font-mono">{current.hindsightState}</p>
            
            {current.recalledMemory && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-2 border-t border-purple-500/20">
                <div className="bg-red-950/50 border border-red-800/40 p-2 rounded flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <div>
                    <span className="text-red-400 font-bold block text-[10px]">RECALLED FAILED STEP</span>
                    <span className="text-red-200 text-xs">{current.recalledMemory.failed}</span>
                  </div>
                </div>
                <div className="bg-emerald-950/50 border border-emerald-800/40 p-2 rounded flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <div>
                    <span className="text-emerald-400 font-bold block text-[10px]">RECALLED WORKING FIX</span>
                    <span className="text-emerald-200 text-xs">{current.recalledMemory.working}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Generated AI Response */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-emerald-400" /> Generated Agent Response:
          </span>
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
            {current.response}
          </div>
        </div>

        {/* Business Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Outcome</span>
            <span className="text-slate-200 font-semibold block mt-1">{current.issueOutcome}</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Resolution Speed</span>
            <span className="text-indigo-300 font-bold font-mono block mt-1">{current.timeToResolution}</span>
          </div>
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
            <span className="text-slate-500 block text-[10px] uppercase font-bold">Customer CSAT</span>
            <span className="text-emerald-400 font-bold font-mono block mt-1">{current.satisfaction}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
