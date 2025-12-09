import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';
import { Product } from '../types';

const ProductForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addProduct, updateProduct, profile } = useStore();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [trackStock, setTrackStock] = useState(false);
  const [stock, setStock] = useState('0');
  const [image, setImage] = useState<string>('');

  useEffect(() => {
    if (id) {
      const product = products.find(p => p.id === id);
      if (product) {
        setName(product.name);
        setPrice(product.price.toString());
        setDescription(product.description || '');
        setTrackStock(product.trackStock);
        setStock(product.stock.toString());
        setImage(product.image || '');
      }
    }
  }, [id, products]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name || !price) return alert('Name and Price are required');

    const productData: Product = {
      id: id || Math.random().toString(36).substr(2, 9),
      name,
      price: parseFloat(price),
      description,
      trackStock,
      stock: trackStock ? parseInt(stock) : 0,
      image
    };

    if (id) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    navigate('/products');
  };

  return (
    <div className="p-6 pb-24">
      <header className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-500 mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-xl font-bold text-slate-900">{id ? 'Edit Product' : 'New Product'}</h1>
      </header>

      <div className="space-y-6">
        {/* Image Uploader */}
        <div className="flex justify-center">
            <div className="relative group">
                <div className={`w-32 h-32 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-dashed ${image ? 'border-transparent' : 'border-slate-300 bg-slate-50'}`}>
                    {image ? (
                        <img src={image} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-slate-400 flex flex-col items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            <span className="text-xs mt-1">Add Photo</span>
                        </div>
                    )}
                    <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
                {image && (
                    <button 
                        onClick={() => setImage('')} 
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                )}
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
            <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g. Web Design Service"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Price ({profile.currency})</label>
            <input 
                type="number" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="0.00"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description (Optional)</label>
            <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
            />
            </div>

            <div className="flex items-center justify-between py-2">
            <label className="text-sm font-medium text-slate-700">Track Stock</label>
            <button 
                onClick={() => setTrackStock(!trackStock)}
                className={`w-12 h-6 rounded-full p-1 transition-colors ${trackStock ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${trackStock ? 'translate-x-6' : ''}`} />
            </button>
            </div>

            {trackStock && (
            <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-2">Stock Quantity</label>
                <input 
                type="number" 
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
        <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
        >
            Save Product
        </button>
      </div>
    </div>
  );
};

export default ProductForm;