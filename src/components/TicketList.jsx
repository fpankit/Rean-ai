import React, { useState } from 'react';
import { Search, Filter, Database, CheckCircle, Clock, AlertTriangle, ArrowUpDown } from 'lucide-react';

export default function TicketList({ tickets = [], onStatusChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.callerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 space-y-5 shadow-2xl">
      {/* Table Header & Search Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-base font-bold text-white">Firebase Case Management Database</h3>
            <p className="text-xs text-slate-400">Live synced support tickets & call records</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ID, Caller, Category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 w-56"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Escalated">Escalated</option>
            <option value="In Progress">In Progress</option>
            <option value="Open">Open</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Tickets Data Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Caller & Phone</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Languages</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredTickets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-500 italic">
                  No matching tickets found in database.
                </td>
              </tr>
            ) : (
              filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-4 py-3 font-mono text-indigo-400 font-bold">{t.id}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-white">{t.callerName}</div>
                    <div className="text-[10px] text-slate-500">{t.phone}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200">{t.category}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                      {Array.isArray(t.languagesUsed) ? t.languagesUsed.join(', ') : 'Hindi, English'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold ${
                      (t.confidenceScore || 80) > 75 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {t.confidenceScore || 80}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === 'Escalated'
                        ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                        : t.status === 'In Progress'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                        : t.status === 'Resolved'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={t.status}
                      onChange={(e) => onStatusChange(t.id, e.target.value)}
                      className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-700 text-[11px] text-slate-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Escalated">Escalated</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Open">Open</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
