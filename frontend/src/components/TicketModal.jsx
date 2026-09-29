import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle, Send, Brain } from 'lucide-react';
import { api } from '../services/api';

export default function TicketModal({ isOpen, onClose, customer, initialIssue = '' }) {
  const [subject, setSubject] = useState(initialIssue || '');
  const [category, setCategory] = useState('Payments & Billing');
  const [priority, setPriority] = useState('High');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim()) return;

    setIsSubmitting(true);
    await api.escalateTicket({
      customer_id: customer.id,
      subject: subject,
      category: category,
      priority: priority
    });
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const handleDone = () => {
    setSubmitted(false);
    setSubject('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto glow-emerald">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Support Ticket Escalated!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your ticket has been assigned to Senior Operations Tier-2 Support. The full Hindsight memory history for <span className="font-semibold text-indigo-300">{customer.name}</span> has been attached.
            </p>
            <button
              onClick={handleDone}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2 rounded-xl font-semibold transition"
            >
              Return to Support Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-950 border border-red-800/40 rounded-xl text-red-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Create / Escalate Ticket</h3>
                <p className="text-xs text-slate-400">Escalate issue for {customer.name} ({customer.company}).</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Issue Summary / Subject</label>
              <textarea
                required
                rows={3}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Describe the issue in detail..."
                className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option>Payments & Billing</option>
                  <option>API & SDK Integration</option>
                  <option>SSO & Authentication</option>
                  <option>Webhooks & Events</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-slate-950 text-slate-100 text-xs p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500"
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Urgent / Escalated</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-purple-950/40 border border-purple-800/40 rounded-xl text-[11px] text-purple-200 flex items-center gap-2">
              <Brain className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Hindsight memory bank for {customer.id} will be automatically attached to this ticket.</span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !subject.trim()}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs px-5 py-2.5 rounded-xl font-semibold transition flex items-center gap-1.5 shadow-lg shadow-red-600/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Ticket'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
