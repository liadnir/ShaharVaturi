import React, { useState, useCallback, useMemo } from 'react';
import { QuoteInput, CalculationResult, ClientDetails } from '../types';
import { exportQuoteToPdf } from '../utils/pdfGenerator';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { PDFIcon } from './icons/PDFIcon';
import { EmailIcon } from './icons/EmailIcon';

interface ClientQuoteProps {
  clientDetails: ClientDetails;
  input: QuoteInput;
  result: CalculationResult;
}

const ClientQuote: React.FC<ClientQuoteProps> = ({ clientDetails, input, result }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const formatCurrency = useCallback((value: number) => 
    new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value),
    []
  );

  const finalPriceFormatted = useMemo(() => formatCurrency(result.finalPrice), [result.finalPrice, formatCurrency]);
  const finalPriceWithVatFormatted = useMemo(() => formatCurrency(result.finalPriceWithVAT), [result.finalPriceWithVAT, formatCurrency]);

  const quoteTextForDisplay = useMemo(() => {
    return [
      `נושא: הצעת מחיר לסדנת נגרות - ${input.workshopName}`,
      '',
      `שלום רב,`,
      '',
      `בהמשך לשיחתנו, אני שמח להגיש הצעת מחיר עבור סדנת הנגרות "${input.workshopName}" המיועדת ל-${input.participants} משתתפים.`,
      '',
      'הסדנה כוללת:',
      `• הגעה מלאה עד אליכם עם כל הציוד הנדרש.`,
      `• חומרי גלם איכותיים (עץ וכו') עבור כל המשתתפים.`,
      `• הנחיה מקצועית וליווי אישי לאורך הפעילות (כ-${input.workshopHours} שעות).`,
      `• בסיום, כל משתתף יוצא עם התוצר שהכין בעצמו.`,
      '',
      `עלות כוללת: ${finalPriceFormatted} (לא כולל מע"מ)`,
      `סה"כ לתשלום כולל מע"מ: ${finalPriceWithVatFormatted}`,
      '',
      `אני זמין לכל שאלה,`,
      `שחר`,
      `עץ השחר - סדנאות נגרות ניידות`
    ].join('\n');
  }, [input, finalPriceFormatted, finalPriceWithVatFormatted]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(quoteTextForDisplay).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [quoteTextForDisplay]);

  const handleExportPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const fileName = `הצעת מחיר - ${clientDetails.businessName} - ${new Date().toLocaleDateString('he-IL').replace(/\./g, '-')}`;
      await exportQuoteToPdf(clientDetails, input, result, fileName);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("אירעה שגיאה ביצירת קובץ ה-PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleEmail = () => {
    const subject = `הצעת מחיר מסדנת "עץ השחר" עבור ${input.workshopName}`;
    
    const emailLines = [
        `שלום ${clientDetails.businessName},`,
        '',
        `בהמשך לשיחתנו, אני שמח להגיש הצעת מחיר עבור סדנת הנגרות "${input.workshopName}" המיועדת ל-${input.participants} משתתפים.`,
        '',
        'הסדנה כוללת:',
        '• הגעה מלאה עד אליכם עם כל הציוד הנדרש.',
        "• חומרי גלם איכותיים (עץ וכו') עבור כל המשתתפים.",
        `• הנחיה מקצועית וליווי אישי לאורך הפעילות (כ-${input.workshopHours} שעות).`,
        '• בסיום, כל משתתף יוצא עם התוצר שהכין בעצמו.',
        '',
        `עלות כוללת: ${finalPriceFormatted} (לא כולל מע"מ)`,
        `סה"כ לתשלום כולל מע"מ: ${finalPriceWithVatFormatted}`,
        '',
        'אני זמין לכל שאלה,',
        '',
        'בברכה,',
        'שחר',
        'עץ השחר - סדנאות נגרות ניידות',
        '054-1234567',
        'shahar@email.com'
    ];
    
    // Prepend each line with a Right-to-Left Mark (RLM) to force RTL alignment in email clients.
    // Use CRLF (\r\n) for newlines for maximum compatibility.
    const emailBody = emailLines.map(line => `\u200F${line}`).join('\r\n');
    
    const mailtoLink = `mailto:${clientDetails.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="p-4 bg-slate-50 border-r-4 border-slate-500 rounded-r-lg">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div>
            <h3 className="text-lg font-bold text-slate-900">הצעת מחיר מוכנה לשליחה</h3>
            <p className="text-sm text-slate-600">העתק, ייצא ל-PDF, או שלח ישירות למייל.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors text-white ${
                isCopied
                  ? 'bg-green-600'
                  : 'bg-slate-700 hover:bg-slate-800'
              }`}
            >
              {isCopied ? <CheckIcon /> : <ClipboardIcon />}
              {isCopied ? 'הועתק!' : 'העתק טקסט'}
            </button>
             <button
              onClick={handleEmail}
              className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors bg-blue-600 text-white hover:bg-blue-700"
            >
              <EmailIcon />
              פתח במייל
            </button>
            <button
              onClick={handleExportPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors bg-red-600 text-white hover:bg-red-700 disabled:bg-slate-400 disabled:cursor-wait"
            >
              <PDFIcon />
              {isGeneratingPdf ? 'מייצא...' : 'ייצא ל-PDF'}
            </button>
        </div>
      </div>
      
      <pre className="bg-white p-4 rounded-md border border-slate-200 text-slate-800 whitespace-pre-wrap text-sm leading-relaxed font-sans">
        {quoteTextForDisplay}
      </pre>
    </div>
  );
};

export default ClientQuote;