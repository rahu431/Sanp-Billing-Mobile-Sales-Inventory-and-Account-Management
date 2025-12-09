import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateInvoice from './pages/CreateInvoice';
import InvoiceList from './pages/InvoiceList';
import InvoiceView from './pages/InvoiceView';
import Settings from './pages/Settings';
import Products from './pages/Products';
import ProductForm from './pages/ProductForm';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminUsers from './pages/AdminUsers';
import Legal from './pages/Legal';
import { useStore } from './store';

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser, loaded } = useStore();
  const location = useLocation();

  if (!loaded) return null; // Or a spinner

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { currentUser, loaded } = useStore();
  
  if (!loaded) return null;

  if (currentUser?.role !== 'super_admin') {
     return <Navigate to="/" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/legal" element={<Legal />} />
        
        <Route path="/" element={<RequireAuth><Layout><Dashboard /></Layout></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><Layout><InvoiceList /></Layout></RequireAuth>} />
        <Route path="/products" element={<RequireAuth><Layout><Products /></Layout></RequireAuth>} />
        <Route path="/products/new" element={<RequireAuth><ProductForm /></RequireAuth>} />
        <Route path="/products/:id" element={<RequireAuth><ProductForm /></RequireAuth>} />
        <Route path="/create" element={<RequireAuth><CreateInvoice /></RequireAuth>} />
        <Route path="/invoice/:id" element={<RequireAuth><InvoiceView /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><Settings /></RequireAuth>} />
        
        <Route path="/admin" element={<RequireAuth><RequireAdmin><Layout><AdminUsers /></Layout></RequireAdmin></RequireAuth>} />
      </Routes>
    </HashRouter>
  );
};

export default App;