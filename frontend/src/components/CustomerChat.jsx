import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Brain, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  History, 
  Bot, 
  User, 
  ShieldAlert, 
  ThumbsUp, 
  ThumbsDown,
  ArrowRight,
  Info,
  Clock,
  Check
} from 'lucide-react';
import { api } from '../services/api';

export default function CustomerChat({ customer, onOpenTicketModal, onMemoryUpdated }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState([]);
  const messagesEndRef = useRef(null);

  // Quick preset prompts for testing
  const presets = [
    { title: "Payment Failure", query: "My payment is failing again during checkout renewal!" },
    { title: "API Rate Limit", query: "Our backend script is hitting HTTP 429 Rate Limit error." },
    { title: "SSO Login Error", query: "Okta SAML login is giving assertion validation failed error." },
    { title: "Refund Policy", query: "How do I request a refund for invoice #9812?" }
  ];

  // Load initial welcome message & memories when customer changes
  useEffect(() => {
    loadCustomerMemories();
    
    // Set initial initial chat state
    setMessages([
      {
        id: 'welcome-1',
        sender: 'bot',
        text: `Hello ${customer.name}! I am your AI Support Assistant powered by Hindsight persistent memory.\n\nI have access to your past support history with ${customer.company} (${customer.environment}). How can I help you today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        memoryRecalled: false
      }
    ]);
  }, [customer.id]);

  const loadCustomerMemories = async () => {
    const mems = await api.getMemories(customer.id);
    setMessages(prev => [...prev]);
    setMemories(mems);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend = inputText) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await api.sendMessage({
        customer_id: customer.id,
        message: textToSend,
        environment: customer.environment
      });

      const botMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'bot',
        text: response.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        memoryRecalled: response.memory_recalled,
        recalledMemory: response.recalled_memory,
        ragSources: response.rag_sources,
        feedbackGiven: false
      };

      setMessages(prev => [...prev, botMessage]);
      if (onMemoryUpdated) onMemoryUpdated();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (msgId, isSolved) => {
    setMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return {
          ...m,
          feedbackGiven: true,
          feedbackSolved: isSolved
        };
      }
      return m;
    }));

    await api.submitFeedback({
      customer_id: customer.id,
      resolved: isSolved,
      message_id: msgId
    });

    // Retain feedback experience notification message
    const notificationMsg = {
      id: `notif-${Date.now()}`,
      sender: 'system',
      text: isSolved 
        ? "✅ Outcome Retained: Solution marked as SUCCESSFUL and stored into Hindsight memory bank for future interactions!"
        : "⚠️ Outcome Retained: Marked as FAILED attempt. Hindsight memory updated to avoid this step in future troubleshooting.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSolved: isSolved
    };

    setMessages(prev => [...prev, notificationMsg]);
    if (onMemoryUpdated) onMemoryUpdated();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] max-w-7xl mx-auto w-full p-2 sm:p-4 gap-4">
      {/* Top Customer Info Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <img 
            src={customer.avatar} 
            alt={customer.name} 
            className="w-10 h-10 rounded-full border-2 border-indigo-500/40 object-cover shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-white">{customer.name}</h2>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 px-2 py-0.5 rounded font-medium">
                {customer.company}
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                {customer.plan}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-mono">
              <span>Env: {customer.environment}</span>
            </p>
          </div>
        </div>

        {/* Hindsight Memory Stats Badge */}
        <div className="flex items-center gap-4 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
          <div className="flex items-center gap-1.5">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">Memories Retained:</span>
            <span className="text-purple-300 font-bold font-mono">{memories.length || customer.stats.memoryBankSize}</span>
          </div>
          <div className="h-4 w-px bg-slate-800"></div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-sky-400" />
            <span className="text-slate-400">Total Tickets:</span>
            <span className="text-sky-300 font-bold font-mono">{customer.stats.totalTickets}</span>
          </div>
          <button
            onClick={() => onOpenTicketModal(customer)}
            className="ml-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-2.5 py-1 rounded font-medium transition shadow-sm flex items-center gap-1"
          >
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-xl">
        {/* Chat Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {/* User or Bot or System Message */}
              {msg.sender === 'system' ? (
                <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  msg.isSolved 
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' 
                    : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                }`}>
                  <Sparkles className="w-4 h-4 flex-shrink-0" />
                  <span>{msg.text}</span>
                </div>
              ) : (
                <div className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* Bot Avatar */}
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-indigo-300" />
                    </div>
                  )}

                  <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                    {/* Hindsight Memory Recall Banner if Bot Recalled Past Memory */}
                    {msg.sender === 'bot' && msg.memoryRecalled && (
                      <div className="bg-gradient-to-r from-purple-950/80 to-indigo-950/80 border border-purple-500/40 rounded-lg p-3 text-xs shadow-md glow-purple">
                        <div className="flex items-center justify-between border-b border-purple-500/30 pb-1.5 mb-2">
                          <div className="flex items-center gap-1.5 font-semibold text-purple-300">
                            <Brain className="w-4 h-4 text-purple-400 animate-pulse" />
                            <span>Hindsight Recalled Past Memory</span>
                            <span className="bg-purple-900/80 text-purple-200 text-[10px] px-1.5 py-0.2 rounded font-mono border border-purple-500/30">
                              {msg.recalledMemory?.id || 'Mem ID #101'}
                            </span>
                          </div>
                          <span className="text-[10px] text-purple-400 font-mono">
                            Confidence: {((msg.recalledMemory?.confidence || 0.95) * 100).toFixed(0)}%
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                          <div className="bg-red-950/40 border border-red-800/40 p-1.5 rounded">
                            <span className="text-red-400 font-semibold block flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Past Failed Attempt:
                            </span>
                            <span className="text-red-200">{msg.recalledMemory?.failed_attempt || 'Clear browser cache'}</span>
                          </div>
                          <div className="bg-emerald-950/40 border border-emerald-800/40 p-1.5 rounded">
                            <span className="text-emerald-400 font-semibold block flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Past Working Fix:
                            </span>
                            <span className="text-emerald-200">{msg.recalledMemory?.successful_attempt || 'Update card zip code'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* RAG Knowledge Source Tag */}
                    {msg.sender === 'bot' && msg.ragSources && msg.ragSources.length > 0 && (
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-950/70 px-2.5 py-1 rounded border border-slate-800 w-fit">
                        <BookOpen className="w-3 h-3 text-sky-400" />
                        <span>RAG Knowledge Base:</span>
                        <span className="text-sky-300 font-medium">{msg.ragSources[0].title}</span>
                      </div>
                    )}

                    {/* Message Bubble Content */}
                    <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user' 
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md' 
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Timestamp & Interactive Feedback Bar */}
                    <div className={`flex items-center gap-2 text-[10px] text-slate-500 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <span>{msg.timestamp}</span>

                      {msg.sender === 'bot' && msg.id !== 'welcome-1' && (
                        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-800">
                          {msg.feedbackGiven ? (
                            <span className="text-indigo-400 flex items-center gap-1 font-mono">
                              <Check className="w-3 h-3" /> Outcome Feedback Recorded
                            </span>
                          ) : (
                            <>
                              <span className="text-slate-400 font-medium">Was this helpful?</span>
                              <button
                                onClick={() => handleFeedback(msg.id, true)}
                                className="flex items-center gap-1 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded transition"
                              >
                                <ThumbsUp className="w-3 h-3" /> Yes, Solved
                              </button>
                              <button
                                onClick={() => handleFeedback(msg.id, false)}
                                className="flex items-center gap-1 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded transition"
                              >
                                <ThumbsDown className="w-3 h-3" /> Still Failing
                              </button>
                              <button
                                onClick={() => onOpenTicketModal(customer, msg.text)}
                                className="flex items-center gap-1 bg-red-950/40 hover:bg-red-900/40 text-red-300 border border-red-800/40 px-2 py-0.5 rounded transition"
                              >
                                <ShieldAlert className="w-3 h-3" /> Escalate
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* User Avatar */}
                  {msg.sender === 'user' && (
                    <img 
                      src={customer.avatar} 
                      alt={customer.name} 
                      className="w-8 h-8 rounded-full border border-indigo-500/40 object-cover flex-shrink-0 mt-1"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-indigo-300 bg-slate-950 p-3 rounded-xl border border-slate-800 w-fit animate-pulse">
              <Brain className="w-4 h-4 text-purple-400 animate-spin" />
              <span>Querying Hindsight Memory Bank & Generating Contextual Support Response...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="p-2 bg-slate-950 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] uppercase font-bold text-slate-500 px-2 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-purple-400" /> Presets:
          </span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p.query)}
              className="bg-slate-900 hover:bg-indigo-950/80 text-slate-300 hover:text-indigo-200 border border-slate-800 hover:border-indigo-500/40 text-xs px-2.5 py-1 rounded-lg transition whitespace-nowrap flex items-center gap-1.5"
            >
              <span>{p.title}</span>
              <ArrowRight className="w-3 h-3 opacity-60" />
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`Describe issue for ${customer.name}... (Hindsight memory will recall past attempts)`}
            className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-500 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 transition shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white p-2.5 rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center font-medium"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
