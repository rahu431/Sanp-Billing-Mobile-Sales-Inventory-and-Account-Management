import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const Settings: React.FC = () => {
  const { profile, updateProfile, logout, currentUser } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email || '',
    website: profile.website || '',
    taxNumber: profile.taxNumber || '',
    currency: profile.currency,
    defaultTaxRate: profile.defaultTaxRate || 0,
    defaultHandling: profile.defaultHandling || 0,
    defaultPackaging: profile.defaultPackaging || 0,
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    updateProfile({ ...profile, ...formData });
    navigate('/');
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="p-6 pb-24 animate-fade-in bg-slate-50 min-h-screen">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="text-slate-500 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 className="text-xl font-bold text-slate-900">Settings</h1>
        </div>
        <button onClick={handleLogout} className="text-red-500 font-medium text-sm">
            Logout
        </button>
      </header>

      <div className="space-y-6">
        {/* User Info */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
            <div>
                <p className="text-xs text-indigo-400 uppercase font-bold">Logged in as</p>
                <p className="font-semibold text-indigo-900">{currentUser?.name}</p>
                <p className="text-xs text-indigo-700">{currentUser?.email}</p>
            </div>
            {currentUser?.role === 'super_admin' && (
                <span className="bg-indigo-600 text-white text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold">Admin</span>
            )}
        </div>

        {/* Business Details */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Business Profile</h2>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Business Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="contact@..."
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID / GST</label>
               <input 
                 type="text" 
                 value={formData.taxNumber}
                 onChange={(e) => handleChange('taxNumber', e.target.value)}
                 className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 placeholder="Optional"
               />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
               {['$', '€', '£', '₹', '¥'].map(c => (
                 <button
                   key={c}
                   onClick={() => handleChange('currency', c)}
                   className={`flex-shrink-0 w-12 h-12 rounded-lg border font-bold text-lg flex items-center justify-center transition-colors ${formData.currency === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'}`}
                 >
                   {c}
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Default Charges */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wide">Default Charges</h2>
          <p className="text-xs text-slate-400">These will be automatically applied to new invoices.</p>
          
          <div className="grid grid-cols-3 gap-3">
             <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Tax Rate (%)</label>
                <input 
                  type="number" 
                  value={formData.defaultTaxRate}
                  onChange={(e) => handleChange('defaultTaxRate', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 text-center rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Handling ({formData.currency})</label>
                <input 
                  type="number" 
                  value={formData.defaultHandling}
                  onChange={(e) => handleChange('defaultHandling', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 text-center rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
             <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Package ({formData.currency})</label>
                <input 
                  type="number" 
                  value={formData.defaultPackaging}
                  onChange={(e) => handleChange('defaultPackaging', parseFloat(e.target.value) || 0)}
                  className="w-full p-2 text-center rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
             </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50">
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-xl font-bold text-white bg-indigo-600 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;