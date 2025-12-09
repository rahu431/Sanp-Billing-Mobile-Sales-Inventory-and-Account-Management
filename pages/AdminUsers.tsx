import React from 'react';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const AdminUsers: React.FC = () => {
  const { users, approveUser, rejectUser, currentUser } = useStore();
  const navigate = useNavigate();

  // Guard: Double check role
  if (currentUser?.role !== 'super_admin') {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'approved' && u.role !== 'super_admin');

  return (
    <div className="p-6 pb-24 animate-fade-in">
       <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
      </header>
      
      <div className="space-y-6">
          {/* Pending Requests */}
          <div>
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Pending Approvals ({pendingUsers.length})</h2>
              {pendingUsers.length === 0 ? (
                  <p className="text-slate-400 text-sm italic bg-white p-4 rounded-xl border border-slate-100">No pending requests</p>
              ) : (
                  <div className="space-y-3">
                      {pendingUsers.map(user => (
                          <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-l-4 border-l-yellow-400 border-slate-100">
                              <div className="flex justify-between items-start mb-3">
                                  <div>
                                      <h3 className="font-bold text-slate-900">{user.name}</h3>
                                      <p className="text-sm text-slate-500">{user.email}</p>
                                      <p className="text-xs text-slate-400 mt-1">Requested: {new Date(user.registeredAt).toLocaleDateString()}</p>
                                  </div>
                              </div>
                              <div className="flex gap-2">
                                  <button 
                                    onClick={() => approveUser(user.id)}
                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                                  >
                                      Approve
                                  </button>
                                  <button 
                                    onClick={() => rejectUser(user.id)}
                                    className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                                  >
                                      Reject
                                  </button>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>

          {/* Active Users */}
          <div>
            <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Active Users</h2>
             {activeUsers.length === 0 ? (
                  <p className="text-slate-400 text-sm italic">No other active users</p>
              ) : (
                <div className="space-y-2">
                    {activeUsers.map(user => (
                        <div key={user.id} className="bg-white p-3 rounded-xl border border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold text-slate-900 text-sm">{user.name}</h3>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">Approved</span>
                        </div>
                    ))}
                </div>
              )}
          </div>
      </div>
    </div>
  );
};

export default AdminUsers;