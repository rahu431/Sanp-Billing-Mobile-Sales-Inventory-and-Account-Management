import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser } = useStore();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
        {children}
        
        {/* Footer with Copyright and Links */}
        <div className="p-8 text-center text-slate-400 text-xs space-y-2 mb-10">
          <p>&copy; {new Date().getFullYear()} SnapBill. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <Link to="/legal?tab=privacy" className="hover:text-slate-600">Privacy Policy</Link>
            <Link to="/legal?tab=terms" className="hover:text-slate-600">Terms & Conditions</Link>
          </div>
          <p className="mt-2">Created by rahu431@gmail.com</p>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 flex justify-between items-center z-50 shadow-lg">
        <Link to="/" className={`flex flex-col items-center gap-1 w-14 ${isActive('/') && location.pathname === '/' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        
        <Link to="/products" className={`flex flex-col items-center gap-1 w-14 ${isActive('/products') ? 'text-indigo-600' : 'text-slate-400'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          <span className="text-[10px] font-medium">Items</span>
        </Link>

        <Link to="/create" className="flex flex-col items-center justify-center -mt-8 relative z-10">
          <div className="bg-indigo-600 text-white rounded-full p-4 shadow-xl hover:bg-indigo-700 transition-colors border-4 border-slate-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </div>
        </Link>

        {isSuperAdmin && (
           <Link to="/admin" className={`flex flex-col items-center gap-1 w-14 ${isActive('/admin') ? 'text-indigo-600' : 'text-slate-400'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span className="text-[10px] font-medium">Admin</span>
          </Link>
        )}
        
        <Link to="/settings" className={`flex flex-col items-center gap-1 w-14 ${isActive('/settings') ? 'text-indigo-600' : 'text-slate-400'}`}>
           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
           <span className="text-[10px] font-medium">Settings</span>
        </Link>
      </nav>
    </div>
  );
};

export default Layout;