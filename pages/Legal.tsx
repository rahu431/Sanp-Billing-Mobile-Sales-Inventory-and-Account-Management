import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Legal: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'terms') setActiveTab('terms');
    else setActiveTab('privacy');
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
         <div className="flex items-center p-4">
            <button onClick={() => navigate(-1)} className="text-slate-500 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 className="text-lg font-bold text-slate-900">Legal</h1>
         </div>
         <div className="flex">
             <button 
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'privacy' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
             >
                 Privacy Policy
             </button>
             <button 
                onClick={() => setActiveTab('terms')}
                className={`flex-1 py-3 text-sm font-medium border-b-2 ${activeTab === 'terms' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500'}`}
             >
                 Terms & Conditions
             </button>
         </div>
      </header>

      <div className="p-6 text-slate-700 text-sm leading-relaxed space-y-4">
         {activeTab === 'privacy' ? (
             <div className="animate-fade-in">
                 <h2 className="text-lg font-bold text-slate-900 mb-2">Privacy Policy</h2>
                 <p className="text-slate-400 text-xs mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
                 
                 <p>Welcome to SnapBill. This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you use our mobile application.</p>
                 
                 <h3 className="font-bold text-slate-900 mt-4 mb-2">1. Collection of Data</h3>
                 <p>We collect information that you voluntarily provide to us when registering at the Application, expressing an interest in obtaining information about us or our products and services, when participating in activities on the Application.</p>
                 
                 <h3 className="font-bold text-slate-900 mt-4 mb-2">2. Use of Data</h3>
                 <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Application to create and manage your account and invoice data.</p>
                 
                 <h3 className="font-bold text-slate-900 mt-4 mb-2">3. Contact</h3>
                 <p>For any questions regarding this privacy policy, please contact us at: <strong>rahu431@gmail.com</strong>.</p>
             </div>
         ) : (
            <div className="animate-fade-in">
                 <h2 className="text-lg font-bold text-slate-900 mb-2">Terms and Conditions</h2>
                 <p className="text-slate-400 text-xs mb-4">Last Updated: {new Date().toLocaleDateString()}</p>
                 
                 <p>These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and SnapBill (“we,” “us” or “our”).</p>
                 
                 <h3 className="font-bold text-slate-900 mt-4 mb-2">1. Agreement to Terms</h3>
                 <p>By accessing the Site, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the application.</p>
                 
                 <h3 className="font-bold text-slate-900 mt-4 mb-2">2. User Registration</h3>
                 <p>You may be required to register with the Application. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
                 
                 <h3 className="font-bold text-slate-900 mt-4 mb-2">3. Modifications</h3>
                 <p>We reserve the right to change, modify, or remove the contents of the Application at any time or for any reason at our sole discretion without notice.</p>
                 
                 <h3 className="font-bold text-slate-900 mt-4 mb-2">4. Contact</h3>
                 <p>For support, please contact: <strong>rahu431@gmail.com</strong>.</p>
             </div>
         )}
      </div>
    </div>
  );
};

export default Legal;