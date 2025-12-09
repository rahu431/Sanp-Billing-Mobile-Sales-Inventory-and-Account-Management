import React, { useState, useMemo } from 'react';
import { useStore } from '../store';
import InvoiceCard from '../components/InvoiceCard';
import { useNavigate } from 'react-router-dom';

const InvoiceList: React.FC = () => {
  const { invoices, profile } = useStore();
  const navigate = useNavigate();

  const [timeFilter, setTimeFilter] = useState<'all' | 'this_month' | 'last_month' | 'last_3_months'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

  // Filter Logic
  const filteredInvoices = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return invoices.filter(inv => {
      const d = new Date(inv.date);
      
      // Time Filter
      let timeMatch = true;
      if (timeFilter === 'this_month') {
        timeMatch = d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      } else if (timeFilter === 'last_month') {
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        timeMatch = d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
      } else if (timeFilter === 'last_3_months') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        timeMatch = d >= threeMonthsAgo;
      }

      // Status Filter
      let statusMatch = true;
      if (statusFilter === 'paid') statusMatch = inv.status === 'paid';
      if (statusFilter === 'unpaid') statusMatch = inv.status !== 'paid';

      return timeMatch && statusMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [invoices, timeFilter, statusFilter]);

  // Calculations
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalCount = filteredInvoices.length;

  // Export to Excel (CSV)
  const handleExport = () => {
    const headers = ['Invoice Number', 'Date', 'Customer Name', 'Status', 'Currency', 'Subtotal', 'Tax', 'Total Amount'];
    
    const rows = filteredInvoices.map(inv => {
      // Escape quotes for CSV
      const customer = `"${inv.customer.name.replace(/"/g, '""')}"`;
      return [
        inv.number,
        new Date(inv.date).toLocaleDateString(),
        customer,
        inv.status.toUpperCase(),
        inv.currency,
        inv.subtotal.toFixed(2),
        (inv.total - inv.subtotal).toFixed(2), // Approximate Tax+Fees
        inv.total.toFixed(2)
      ].join(',');
    });
    
    // Add BOM for Excel utf-8 compatibility
    const csvContent = "\uFEFF" + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Statement_${profile.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 pb-24 animate-fade-in flex flex-col h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Statements</h1>
        <button 
          onClick={handleExport}
          disabled={filteredInvoices.length === 0}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Export
        </button>
      </div>
      
      {/* Filters & Summary */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 space-y-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <select 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
          >
            <option value="all">All Time</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="last_3_months">Last 3 Months</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid Only</option>
            <option value="unpaid">Pending</option>
          </select>
        </div>

        <div className="flex justify-between items-end border-t border-slate-100 pt-3">
           <div>
             <p className="text-xs text-slate-400 font-medium uppercase">Filtered Total</p>
             <p className="text-2xl font-bold text-slate-900">{profile.currency}{totalAmount.toFixed(2)}</p>
           </div>
           <div className="text-right">
             <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">
               {totalCount} Invoices
             </span>
           </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-20">
        {filteredInvoices.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-10 text-slate-400">
             <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
             <p>No invoices match criteria</p>
           </div>
        ) : (
          filteredInvoices.map(inv => (
            <InvoiceCard key={inv.id} invoice={inv} onClick={() => navigate(`/invoice/${inv.id}`)} />
          ))
        )}
      </div>
    </div>
  );
};

export default InvoiceList;