import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const result = register(email, password, name);
    if (result.success) {
      setSuccess(true);
      setError('');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  if (success) {
      return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center animate-fade-in">
           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
           </div>
           <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Sent!</h2>
           <p className="text-slate-500 mb-6 max-w-xs mx-auto">
             An approval request has been sent to <strong>rahu431@gmail.com</strong>. You will be able to login once the admin approves your account.
           </p>
           <Link to="/login" className="px-8 py-3 bg-slate-900 text-white rounded-xl font-medium">Back to Login</Link>
        </div>
      );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
           <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
           <p className="text-slate-500 mt-2">Join SnapBill today</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              placeholder="Create a password"
            />
          </div>

          <button type="submit" className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg shadow-lg hover:bg-indigo-700 active:scale-95 transition-all">
            Submit for Approval
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500">
          Already have an account? <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Login</Link>
        </p>
        
        <div className="mt-8 text-center text-xs text-slate-400">
            By registering, you agree to our <Link to="/legal?tab=terms" className="underline">Terms</Link> & <Link to="/legal?tab=privacy" className="underline">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
};

export default Register;