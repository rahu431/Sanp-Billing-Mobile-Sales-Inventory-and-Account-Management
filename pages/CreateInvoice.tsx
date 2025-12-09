import React, { useState } from 'react';
import { useStore } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LineItem, Invoice, Product } from '../types';
import { parseInvoiceFromText } from '../services/geminiService';

const CreateInvoice: React.FC = () => {
  const { addInvoice, profile, invoices, products } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [mode, setMode] = useState<'manual' | 'ai'>(searchParams.get('mode') === 'manual' ? 'manual' : 'ai');
  const [loading, setLoading] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [showProductModal, setShowProductModal] = useState(false);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<LineItem[]>([{ id: '1', description: '', quantity: 1, price: 0 }]);
  const [notes, setNotes] = useState('');
  
  // Financials State
  const [discount, setDiscount] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(profile.defaultTaxRate || 0);
  const [shipping, setShipping] = useState<number>(0);
  const [handling, setHandling] = useState<number>(profile.defaultHandling || 0);
  const [packaging, setPackaging] = useState<number>(profile.defaultPackaging || 0);

  const generateInvoiceNumber = () => {
    return `INV-${(invoices.length + 1).toString().padStart(4, '0')}`;
  };

  const handleAiParse = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    const result = await parseInvoiceFromText(aiInput);
    if (result) {
      setCustomerName(result.customerName);
      setItems(result.items.map(i => ({ ...i, id: Math.random().toString() })));
      if (result.notes) setNotes(result.notes);
      setMode('manual');
    }
    setLoading(false);
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(), description: '', quantity: 1, price: 0 }]);
  };

  const addProductItem = (product: Product) => {
    setItems([...items.filter(i => i.description), {
      id: Math.random().toString(),
      productId: product.id,
      description: product.name,
      quantity: 1,
      price: product.price
    }]);
    setShowProductModal(false);
  };

  const removeItem = (id: string) => {
    if (items.length > 0) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = Math.max(0, subtotal - discount + taxAmount + shipping + handling + packaging);

  const handleSave = () => {
    if (!customerName) {
      alert("Please enter a customer name");
      return;
    }

    const newInvoice: Invoice = {
      id: Math.random().toString(36).substr(2, 9),
      number: generateInvoiceNumber(),
      date: new Date().toISOString(),
      customer: { id: Math.random().toString(), name: customerName },
      items: items.filter(i => i.description),
      notes,
      status: 'draft',
      currency: profile.currency,
      subtotal,
      discount,
      taxRate,
      shipping,
      handling,
      packaging,
      total
    };

    addInvoice(newInvoice);
    navigate(`/invoice/${newInvoice.id}`);
  };

  return (
    <div className="p-6 pb-24">
      <header className="flex justify-between items-center mb-6">
        <button onClick={() => navigate(-1)} className="text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="font-bold text-lg text-slate-900">New Invoice</h1>
        <div className="w-6"></div> 
      </header>

      {/* Toggle Mode */}
      <div className="bg-slate-100 p-1 rounded-lg flex mb-6">
        <button 
          onClick={() => setMode('ai')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'ai' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          ✨ Magic AI
        </button>
        <button 
          onClick={() => setMode('manual')}
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'manual' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
        >
          Manual
        </button>
      </div>

      {mode === 'ai' ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100 text-center">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm text-indigo-600">
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
             </div>
             <h2 className="text-lg font-semibold text-indigo-900 mb-1">Describe the bill</h2>
             <p className="text-sm text-indigo-600/80">"Bill John Doe for 2 hours of consulting at $50/hr"</p>
          </div>
          <textarea
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            placeholder="Type here..."
            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none bg-white text-base"
          />
          <button
            onClick={handleAiParse}
            disabled={loading || !aiInput}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all ${
              loading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
            }`}
          >
            {loading ? 'Processing...' : 'Generate Invoice'}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</label>
            <input 
              type="text" 
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Items</label>
            </div>
            
            {items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative group">
                <input 
                  type="text"
                  placeholder="Item description"
                  value={item.description}
                  onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                  className="w-full font-medium text-slate-900 placeholder-slate-300 mb-3 focus:outline-none"
                />
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-400 mb-1">QTY</label>
                    <input 
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-50 p-2 rounded-lg text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-slate-400 mb-1">PRICE</label>
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-slate-400 text-sm">{profile.currency}</span>
                      <input 
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-50 p-2 pl-6 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
                <button 
                    onClick={() => removeItem(item.id)}
                    className="absolute -top-2 -right-2 bg-red-100 text-red-500 rounded-full p-1 shadow-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
              </div>
            ))}
            
            <div className="flex gap-3">
               <button 
                  onClick={() => setShowProductModal(true)}
                  className="flex-1 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600 font-medium hover:bg-indigo-100 transition-colors text-sm"
                >
                  + From Products
                </button>
                <button 
                  onClick={addItem}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-slate-500 font-medium hover:bg-slate-50 transition-colors text-sm"
                >
                  + Custom Item
                </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-4">
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{profile.currency}{subtotal.toFixed(2)}</span>
             </div>
             
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Discount ({profile.currency})</span>
                <input 
                   type="number" 
                   value={discount} 
                   onChange={e => setDiscount(parseFloat(e.target.value) || 0)}
                   className="w-20 text-right p-1 bg-slate-50 rounded border border-slate-200"
                />
             </div>

             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Tax (%)</span>
                <input 
                   type="number" 
                   value={taxRate} 
                   onChange={e => setTaxRate(parseFloat(e.target.value) || 0)}
                   className="w-20 text-right p-1 bg-slate-50 rounded border border-slate-200"
                />
             </div>

             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Shipping ({profile.currency})</span>
                <input 
                   type="number" 
                   value={shipping} 
                   onChange={e => setShipping(parseFloat(e.target.value) || 0)}
                   className="w-20 text-right p-1 bg-slate-50 rounded border border-slate-200"
                />
             </div>
             
             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Handling ({profile.currency})</span>
                <input 
                   type="number" 
                   value={handling} 
                   onChange={e => setHandling(parseFloat(e.target.value) || 0)}
                   className="w-20 text-right p-1 bg-slate-50 rounded border border-slate-200"
                />
             </div>

             <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Package ({profile.currency})</span>
                <input 
                   type="number" 
                   value={packaging} 
                   onChange={e => setPackaging(parseFloat(e.target.value) || 0)}
                   className="w-20 text-right p-1 bg-slate-50 rounded border border-slate-200"
                />
             </div>

             <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-lg font-bold text-slate-900">
                <span>Total</span>
                <span>{profile.currency}{total.toFixed(2)}</span>
             </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 shadow-lg hover:bg-indigo-700 active:scale-95 transition-all"
          >
            Create Invoice
          </button>
        </div>
      )}

      {/* Product Selector Modal */}
      {showProductModal && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl max-h-[80vh] flex flex-col animate-fade-in">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold">Select Product</h3>
                  <button onClick={() => setShowProductModal(false)} className="p-2 text-slate-400 hover:text-slate-600">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
               </div>
               <div className="p-4 overflow-y-auto space-y-2">
                  {products.length === 0 && <p className="text-center text-slate-400 py-4">No products found. Add some in the Products tab.</p>}
                  {products.map(p => (
                     <button 
                        key={p.id}
                        onClick={() => addProductItem(p)}
                        className="w-full text-left p-2 rounded-xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 flex items-center gap-3"
                     >
                        <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                           {p.image ? (
                              <img src={p.image} alt="" className="w-full h-full object-cover" />
                           ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-300">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                              </div>
                           )}
                        </div>
                        <div className="flex-1">
                           <div className="font-medium text-slate-900">{p.name}</div>
                           <div className="text-xs text-slate-500">{p.trackStock ? `${p.stock} in stock` : 'Service / Unlimited'}</div>
                        </div>
                        <div className="font-bold text-indigo-600">{profile.currency}{p.price}</div>
                     </button>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default CreateInvoice;