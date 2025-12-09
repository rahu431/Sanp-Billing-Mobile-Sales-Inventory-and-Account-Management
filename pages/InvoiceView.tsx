import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Invoice } from '../types';

const InvoiceView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, profile } = useStore();
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    if (id) {
      const found = invoices.find(i => i.id === id);
      setInvoice(found || null);
    }
  }, [id, invoices]);

  if (!invoice) return <div className="p-8 text-center text-slate-400">Loading...</div>;

  const subtotal = invoice.subtotal || invoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // Fallbacks for older invoices
  const discount = invoice.discount || 0;
  const taxRate = invoice.taxRate || 0;
  const shipping = invoice.shipping || 0;
  const handling = invoice.handling || 0;
  const packaging = invoice.packaging || 0;
  const taxAmount = (subtotal - discount) * (taxRate / 100);
  const total = invoice.total || (subtotal - discount + taxAmount + shipping + handling + packaging);

  const generateShareText = () => {
    let text = `*INVOICE ${invoice.number}*\n`;
    text += `To: ${invoice.customer.name}\n\n`;
    invoice.items.forEach(item => {
      text += `${item.description} (x${item.quantity}): ${invoice.currency}${item.price}\n`;
    });
    text += `\nSubtotal: ${invoice.currency}${subtotal.toFixed(2)}`;
    if(discount > 0) text += `\nDiscount: -${invoice.currency}${discount.toFixed(2)}`;
    if(taxRate > 0) text += `\nTax (${taxRate}%): ${invoice.currency}${taxAmount.toFixed(2)}`;
    if(shipping > 0) text += `\nShipping: ${invoice.currency}${shipping.toFixed(2)}`;
    if(handling > 0) text += `\nHandling: ${invoice.currency}${handling.toFixed(2)}`;
    if(packaging > 0) text += `\nPkg Fee: ${invoice.currency}${packaging.toFixed(2)}`;
    text += `\n*TOTAL: ${invoice.currency}${total.toFixed(2)}*`;
    return encodeURIComponent(text);
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/?text=${generateShareText()}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-24">
       <header className="p-4 flex justify-between items-center bg-white border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="font-bold text-slate-900">{invoice.number}</h1>
        <div className="w-6"></div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto no-scrollbar">
        <div id="invoice-preview" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-indigo-500"></div>
          
          <div className="mb-6 flex justify-between items-start">
             <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">{profile.name}</h2>
                <div className="text-xs text-slate-500 space-y-1">
                   {profile.email && <p>{profile.email}</p>}
                   {profile.taxNumber && <p>Tax ID: {profile.taxNumber}</p>}
                </div>
             </div>
             <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{new Date(invoice.date).toLocaleDateString()}</p>
                <p className="text-xs text-slate-400 uppercase">Date</p>
             </div>
          </div>

          <div className="mb-8 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Bill To</p>
            <h3 className="text-base font-semibold text-slate-900">{invoice.customer.name}</h3>
          </div>

          <table className="w-full mb-6">
            <thead>
              <tr className="text-left text-xs text-slate-400 uppercase border-b border-slate-100">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 font-medium text-right">Amt</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {invoice.items.map((item) => (
                <tr key={item.id} className="border-b border-slate-50 last:border-0">
                  <td className="py-3">
                    <p className="font-medium text-slate-900">{item.description}</p>
                    <p className="text-slate-400 text-xs">x{item.quantity} @ {item.price}</p>
                  </td>
                  <td className="py-3 text-right font-medium text-slate-900">
                    {invoice.currency}{(item.quantity * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Breakdown */}
          <div className="space-y-2 pt-4 border-t border-slate-100 text-sm">
            <div className="flex justify-between text-slate-500">
               <span>Subtotal</span>
               <span>{invoice.currency}{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
               <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{invoice.currency}{discount.toFixed(2)}</span>
               </div>
            )}
            {taxRate > 0 && (
               <div className="flex justify-between text-slate-500">
                  <span>Tax ({taxRate}%)</span>
                  <span>{invoice.currency}{taxAmount.toFixed(2)}</span>
               </div>
            )}
            {shipping > 0 && (
               <div className="flex justify-between text-slate-500">
                  <span>Shipping</span>
                  <span>{invoice.currency}{shipping.toFixed(2)}</span>
               </div>
            )}
            {handling > 0 && (
               <div className="flex justify-between text-slate-500">
                  <span>Handling</span>
                  <span>{invoice.currency}{handling.toFixed(2)}</span>
               </div>
            )}
            {packaging > 0 && (
               <div className="flex justify-between text-slate-500">
                  <span>Pkg Fee</span>
                  <span>{invoice.currency}{packaging.toFixed(2)}</span>
               </div>
            )}
          </div>

          <div className="flex justify-between items-end pt-4 mt-4 border-t-2 border-slate-100">
            <span className="font-bold text-slate-900 text-lg">Total</span>
            <span className="font-bold text-indigo-600 text-2xl">{invoice.currency}{total.toFixed(2)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-4 p-4 bg-yellow-50 text-yellow-800 rounded-xl text-sm">
            <strong>Note:</strong> {invoice.notes}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-40">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={openWhatsApp}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-green-50 text-green-700 font-medium active:scale-95 transition-transform"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"></path></svg>
            <span className="text-xs">WhatsApp</span>
          </button>
          
          <button 
             className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl bg-indigo-50 text-indigo-700 font-medium active:scale-95 transition-transform"
             onClick={() => alert("Printing support coming soon!")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            <span className="text-xs">Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceView;