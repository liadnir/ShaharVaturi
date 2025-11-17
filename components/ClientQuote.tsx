import React, { useState } from 'react';
import { QuoteInput, CalculationResult, ClientDetails } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { RestartIcon } from './icons/RestartIcon';
import { PDFIcon } from './icons/PDFIcon';
import { EmailIcon } from './icons/EmailIcon';
import { VAT_RATE } from '../constants';

interface ClientQuoteProps {
  input: QuoteInput;
  result: CalculationResult;
  clientDetails: ClientDetails;
  onRestart: () => void;
  onDownloadPDF: () => void;
}

const ClientQuote: React.FC<ClientQuoteProps> = ({ input, result, clientDetails, onRestart, onDownloadPDF }) => {
  const [copied, setCopied] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(value);
  }

  const getQuoteText = () => {
    return `
הצעת מחיר עבור: ${clientDetails.businessName}
---
שלום רב,

בהמשך לבקשתך, מצורפת הצעת מחיר עבור סדנת נגרות.

פרטי הסדנה:
- שם הסדנה: ${input.workshopName}
- מספר משתתפים: ${input.participants}
- משך הסדנה: ${input.workshopHours} שעות

עלות:
- מחיר למשתתף: ${formatCurrency(result.finalPrice / input.participants)} (לפני מע"מ)
- סה"כ עלות הסדנה: ${formatCurrency(result.finalPrice)} (לפני מע"מ)
- סה"כ כולל מע"מ (${VAT_RATE * 100}%): ${formatCurrency(result.finalPriceWithVAT)}

המחיר כולל את כל החומרים, הכלים וההדרכה המקצועית הנדרשים לקיום הסדנה.

נשמח לעמוד לרשותכם,
נגר על הבוקר
    `.trim();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getQuoteText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEmail = () => {
    const subject = `הצעת מחיר עבור סדנת '${input.workshopName}'`;
    const body = encodeURIComponent(getQuoteText());
    window.location.href = `mailto:${clientDetails.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-6 bg-white border border-slate-200 rounded-lg shadow-sm">
      <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-slate-800">הצעת מחיר עבור: <span className="text-blue-600">{clientDetails.businessName}</span></h3>
          <p className="text-sm text-slate-500">תאריך: {new Date().toLocaleDateString('he-IL')}</p>
      </div>

      <div className="space-y-4 text-slate-700 bg-slate-50 p-4 rounded-md">
        <div className="flex justify-between items-baseline">
          <span className="font-semibold">שם הסדנה:</span>
          <span className="text-right">{input.workshopName}</span>
        </div>
        <div className="flex justify-between items-baseline">
          <span className="font-semibold">מספר משתתפים:</span>
          <span>{input.participants}</span>
        </div>
         <div className="flex justify-between items-baseline">
          <span className="font-semibold">משך הסדנה (שעות):</span>
          <span>{input.workshopHours}</span>
        </div>
      </div>
      
      <div className="mt-6 border-t pt-6 space-y-3">
          <div className="flex justify-between text-lg">
              <span className="font-semibold text-slate-800">מחיר למשתתף (לפני מע"מ):</span>
              <span className="font-bold text-slate-900">{formatCurrency(result.finalPrice / input.participants)}</span>
          </div>
          <div className="flex justify-between text-lg">
              <span className="font-semibold text-slate-800">סה"כ (לפני מע"מ):</span>
              <span className="font-bold text-slate-900">{formatCurrency(result.finalPrice)}</span>
          </div>
          <div className="p-4 bg-blue-100 rounded-lg mt-2">
            <div className="flex justify-between items-center text-2xl font-extrabold text-blue-800">
                <span>סה"כ כולל מע"מ:</span>
                <span>{formatCurrency(result.finalPriceWithVAT)}</span>
            </div>
          </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-6 text-center">המחיר כולל את כל החומרים, הכלים וההדרכה. תוקף ההצעה: 30 יום.</p>

      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-sm">
        <button onClick={handleCopyToClipboard} className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-md transition-colors">
            {copied ? <CheckIcon/> : <ClipboardIcon />}
            <span>{copied ? 'הועתק!' : 'העתק'}</span>
        </button>
         <button onClick={handleEmail} className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-md transition-colors">
            <EmailIcon />
            <span>שלח במייל</span>
        </button>
        <button onClick={onDownloadPDF} className="flex items-center justify-center gap-2 py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-md transition-colors">
            <PDFIcon/>
            <span>PDF הורד</span>
        </button>
        <button onClick={onRestart} className="col-span-2 sm:col-span-3 lg:col-span-2 flex items-center justify-center gap-2 py-2 px-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-md transition-colors">
            <RestartIcon/>
            <span>התחל מחדש</span>
        </button>
      </div>

    </div>
  );
};

export default ClientQuote;
