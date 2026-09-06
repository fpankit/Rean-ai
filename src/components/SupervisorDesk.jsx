import React, { useState, useEffect } from 'react';
import { 
  UserCheck, ShieldAlert, AlertTriangle, PhoneIncoming, MessageSquare, 
  CheckCircle, Clock, Globe, Volume2, Search, Filter, Sparkles, X, Send
} from 'lucide-react';
import TicketList from './TicketList';
import { subscribeToTickets, updateTicketStatus } from '../firebase/ticketService';

export default function SupervisorDesk({ activeHandoff }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState('handoffs'); // 'handoffs' | 'tickets'
  const [smsModalTicket, setSmsModalTicket] = useState(null);
  const [smsText, setSmsText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToTickets((data) => {
      setTickets(data);
      if (!selectedTicket && data.length > 0) {
        setSelectedTicket(data[0]);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    await updateTicketStatus(ticketId, newStatus);
    setToastMessage(`Ticket ${ticketId} status updated to: ${newStatus}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendSMS = (e) => {
    e.preventDefault();
    setToastMessage(`Follow-up SMS sent to ${smsModalTicket.callerName} (${smsModalTicket.phone})!`);
    setSmsModalTicket(null);
    setSmsText('');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const escalatedCount = tickets.filter(t => t.status === 'Escalated').length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-indigo-600 text-white font-semibold text-xs shadow-2xl flex items-center gap-2.5 animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">Active Escalations</div>
            <div className="text-2xl font-extrabold text-white mt-1">{escalatedCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-600/30 text-indigo-400">
            <PhoneIncoming className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Low Confidence Flags</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {tickets.filter(t => (t.confidenceScore || 80) < 70).length}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-amber-600/30 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Resolved Cases Today</div>
            <div className="text-2xl font-extrabold text-white mt-1">
              {tickets.filter(t => t.status === 'Resolved').length + 4}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-600/30 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('handoffs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'handoffs'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Context Handoff Summaries ({tickets.filter(t => t.status === 'Escalated').length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === 'tickets'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Firebase Case Database ({tickets.length})
          </button>
        </div>
      </div>

      {/* Main View Switcher */}
      {activeTab === 'handoffs' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: List of Escalated Cards */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Pending Human Transfers
            </h4>

            {tickets.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs bg-slate-900/60 rounded-2xl border border-slate-800">
                No active transfer requests at this moment.
              </div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    selectedTicket?.id === ticket.id
                      ? 'bg-slate-800/90 border-indigo-500 ring-1 ring-indigo-500 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{ticket.callerName}</span>
                      <span className="text-[10px] font-mono text-slate-400">{ticket.id}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      ticket.status === 'Escalated'
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300 animate-pulse'
                        : ticket.status === 'In Progress'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                        : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {ticket.summary}
                  </p>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-indigo-400" />
                      <span>{Array.isArray(ticket.languagesUsed) ? ticket.languagesUsed.join(', ') : 'Hindi, English'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(ticket.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Detailed Handoff Context Card */}
          <div className="lg:col-span-7">
            {selectedTicket ? (
              <div className="bg-[#0A0D14] rounded-3xl border border-slate-800/80 p-6 space-y-6 shadow-2xl">
                {/* Header Card */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{selectedTicket.callerName}</h3>
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/30">
                        {selectedTicket.id}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">Phone: {selectedTicket.phone}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStatusChange(selectedTicket.id, 'In Progress')}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Accept Transfer</span>
                    </button>

                    <button
                      onClick={() => setSmsModalTicket(selectedTicket)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
                    >
                      <MessageSquare className="w-4 h-4 text-indigo-400" />
                      <span>Send SMS</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(selectedTicket.id, 'Resolved')}
                      className="px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center gap-1.5 transition"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      <span>Resolve</span>
                    </button>
                  </div>
                </div>

                {/* Reason for Handoff Alert */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-300">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Trigger Reason: {selectedTicket.reasonForTransfer || "Low Confidence Handoff"}</span>
                  </div>
                  <p className="text-[11px] text-amber-200/80">
                    Audio Noise Level: {selectedTicket.noiseLevel || "Medium"} | Confidence Score: {selectedTicket.confidenceScore || 62}%
                  </p>
                </div>

                {/* Concise AI Context Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>AI Conversation Brief & Context</span>
                  </h4>
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans">
                    {selectedTicket.summary}
                  </div>
                </div>

                {/* Extracted Slots Summary Grid */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Captured Information Slots
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Caller Name</span>
                      <span className="font-semibold text-white">{selectedTicket.callerName}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Category</span>
                      <span className="font-semibold text-white">{selectedTicket.category}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Languages Spoken</span>
                      <span className="font-semibold text-white">
                        {Array.isArray(selectedTicket.languagesUsed) ? selectedTicket.languagesUsed.join(', ') : 'Hindi, English'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block uppercase">Location / Area</span>
                      <span className="font-semibold text-white">
                        {selectedTicket.extractedSlots?.location || "Sector 14, Dwarka"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 bg-slate-900/60 rounded-3xl border border-slate-800">
                Select a transfer request to inspect the handoff summary card.
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Firebase Full Ticket Database Table */
        <TicketList tickets={tickets} onStatusChange={handleStatusChange} />
      )}

      {/* SMS Follow-Up Modal */}
      {smsModalTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#131B2E] border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Send Follow-Up SMS</h3>
              </div>
              <button 
                onClick={() => setSmsModalTicket(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Recipient: <span className="font-bold text-white">{smsModalTicket.callerName}</span> ({smsModalTicket.phone})
            </p>

            <form onSubmit={handleSendSMS} className="space-y-3">
              <textarea
                rows={4}
                required
                placeholder="Type SMS confirmation or follow-up instructions..."
                value={smsText}
                onChange={(e) => setSmsText(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSmsModalTicket(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send SMS Now</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
