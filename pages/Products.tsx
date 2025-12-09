import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';

const Products: React.FC = () => {
  const { products, profile, deleteProduct } = useStore();
  const navigate = useNavigate();

  return (
    <div className="p-6 pb-24 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Link to="/products/new" className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-all">
          + New Item
        </Link>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-16 text-slate-400 bg-white rounded-2xl border border-slate-100 border-dashed">
             <p className="mb-2">No products yet</p>
             <p className="text-xs">Add products to track stock and speed up billing.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 group">
              <div onClick={() => navigate(`/products/${product.id}`)} className="w-12 h-12 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden cursor-pointer">
                 {product.image ? (
                     <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                    </div>
                 )}
              </div>
              <div onClick={() => navigate(`/products/${product.id}`)} className="flex-1 cursor-pointer">
                <h3 className="font-semibold text-slate-900 text-sm">{product.name}</h3>
                <div className="flex items-center gap-3 text-xs mt-0.5">
                   <span className="font-medium text-indigo-600">{profile.currency}{product.price.toFixed(2)}</span>
                   {product.trackStock && (
                     <span className={`px-1.5 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                       {product.stock} left
                     </span>
                   )}
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); if(confirm('Delete product?')) deleteProduct(product.id); }}
                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Products;