import React from 'react';
import { Invoice } from '../types';

interface InvoiceCardProps {
  invoice: Invoice;
  onClick: () => void;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, onClick }) => {
  const total = invoice.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center active:bg-slate-50 transition-colors cursor-pointer"
    >
      <div>
        <h3 className="font-semibold text-slate-900">{invoice.customer.name}</h3>
        <p className="text-sm text-slate-500">#{invoice.number} • {new Date(invoice.date).toLocaleDateString()}</p>
      </div>
      <div className="text-right">
        <span className="block font-bold text-slate-900">{invoice.currency}{total.toFixed(2)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${
          invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 
          invoice.status === 'sent' ? 'bg-blue-100 text-blue-700' : 
          'bg-gray-100 text-gray-700'
        }`}>
          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
        </span>
      </div>
    </div>
  );
};

export default InvoiceCard;