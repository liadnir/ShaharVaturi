import React from 'react';
import { QuoteInput, CalculationResult } from '../types';
import { WOOD_PRICE_PER_METER, ASSISTANT_RATE_PER_WORKSHOP_HOUR } from '../constants';

interface InternalBreakdownProps {
  input: QuoteInput;
  result: CalculationResult;
}

const InternalBreakdown: React.FC<InternalBreakdownProps> = ({ input, result }) => {
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);
  }

  return (
    <div className="p-4 bg-amber-50 border-r-4 border-amber-500 rounded-r-lg">
      <h3 className="text-lg font-bold text-amber-900">פירוט פנימי (לעיונך בלבד)</h3>
      <p className="text-sm text-amber-800 mb-4">מבוסס על רווחיות של {Math.round(result.profitMargin * 100)}%</p>
      
      <ul className="space-y-2 text-slate-700">
        <li className="flex justify-between">
          <span>עלות עבודת נגרות ({input.prepHours + input.workshopHours} שעות):</span>
          <span className="font-semibold">{formatCurrency(result.laborCost)}</span>
        </li>
        <li className="flex justify-between">
          <span>עלות נסיעה ({input.distance * 2} ק"מ * {formatCurrency(2)}):</span>
          <span className="font-semibold">{formatCurrency(result.travelCost)}</span>
        </li>
        <li className="flex justify-between">
          <span>עלות עץ ({input.estimatedWoodMeters} מטר * {formatCurrency(WOOD_PRICE_PER_METER)}):</span>
          <span className="font-semibold">{formatCurrency(result.materialsCost)}</span>
        </li>
        {result.assistantCost > 0 && (
          <li className="flex justify-between">
            <span>עלות עובד נוסף ({input.workshopHours} שעות * {formatCurrency(ASSISTANT_RATE_PER_WORKSHOP_HOUR)}):</span>
            <span className="font-semibold">{formatCurrency(result.assistantCost)}</span>
          </li>
        )}
      </ul>
      
      <hr className="my-3 border-slate-300"/>
      
      <div className="flex justify-between font-bold text-slate-800">
        <span>סה"כ עלויות:</span>
        <span>{formatCurrency(result.totalCost)}</span>
      </div>
      
      <div className="flex justify-between font-bold text-green-700 mt-2">
        <span>רווח ({Math.round(result.profitMargin * 100)}%):</span>
        <span>{formatCurrency(result.profitAmount)}</span>
      </div>

      <div className="mt-4 p-3 bg-slate-200 rounded-md text-center space-y-2">
        <div>
          <span className="text-lg font-bold text-slate-900">מחיר סופי ללקוח (לפני מע"מ): {formatCurrency(result.finalPrice)}</span>
        </div>
        <div className="p-2 bg-blue-100 rounded">
          <span className="text-xl font-extrabold text-blue-800">מחיר סופי אחרי מע"מ: {formatCurrency(result.finalPriceWithVAT)}</span>
        </div>
      </div>
    </div>
  );
};

export default InternalBreakdown;
