import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import InvoiceCard from '../components/InvoiceCard';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { invoices, profile } = useStore();
  const navigate = useNavigate();

  const totalRevenue = invoices.reduce((sum, inv) => {
    return sum + inv.items.reduce((s, i) => s + (i.price * i.quantity), 0);
  }, 0);

  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hello, {profile.name}</h1>
          <p className="text-slate-500 text-sm">Welcome back to SnapBill</p>
        </div>
        <Link to="/settings" className="p-2 bg-white rounded-full shadow-sm border border-slate-100">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
        </Link>
      </header>

      {/* Stats Card */}
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
        <p className="text-indigo-200 text-sm font-medium mb-1">Total Sales</p>
        <div className="text-4xl font-bold">{profile.currency}{totalRevenue.toFixed(2)}</div>
        <div className="mt-4 flex gap-2">
           <div className="bg-indigo-500/50 px-3 py-1 rounded-lg text-xs backdrop-blur-sm">
             {invoices.length} Invoices
           </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
         <Link to="/create?mode=ai" className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-xl border border-indigo-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <span className="bg-white p-2 rounded-full shadow-sm text-indigo-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
            </span>
            <span className="font-semibold text-indigo-900 text-sm">Smart Bill</span>
         </Link>
         <Link to="/create?mode=manual" className="bg-white p-4 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <span className="bg-slate-50 p-2 rounded-full text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </span>
            <span className="font-semibold text-slate-900 text-sm">Manual Bill</span>
         </Link>
      </div>

      {/* Recent List */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent</h2>
        <div className="space-y-3">
          {recentInvoices.length === 0 ? (
            <div className="text-center py-8 text-slate-400">No invoices yet. Create your first one!</div>
          ) : (
            recentInvoices.map(inv => (
              <InvoiceCard key={inv.id} invoice={inv} onClick={() => navigate(`/invoice/${inv.id}`)} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;