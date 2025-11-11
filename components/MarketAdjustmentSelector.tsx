import React, { useState } from 'react';
import { MarketSituation } from '../types';

interface MarketAdjustmentSelectorProps {
  onSelect: (situation: MarketSituation, customMargin?: number) => void;
}

const MarketAdjustmentSelector: React.FC<MarketAdjustmentSelectorProps> = ({ onSelect }) => {
  const [customMargin, setCustomMargin] = useState('');
  
  const options = [
    {
      type: MarketSituation.Standard,
      title: '1. רגילה (40% רווח)',
      description: 'הלקוח הסטנדרטי, מחיר ברירת מחדל.',
      buttonClass: 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
    },
    {
      type: MarketSituation.Premium,
      title: '2. פרימיום (+20% רווח)',
      description: 'לקוח שמוכן לשלם יותר / סדנה ייחודית.',
      buttonClass: 'bg-white hover:bg-blue-50 text-blue-700 border-blue-300'
    },
    {
      type: MarketSituation.Competitive,
      title: '3. תחרותית (-10% רווח)',
      description: 'שוק רגיש למחיר / צריך \'לזכות\' בעבודה.',
      buttonClass: 'bg-white hover:bg-green-50 text-green-700 border-green-300'
    }
  ];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const marginValue = parseFloat(customMargin);
    if (!isNaN(marginValue) && marginValue >= 0) {
      onSelect(MarketSituation.Custom, marginValue / 100);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {options.map(option => (
          <button
            key={option.type}
            onClick={() => onSelect(option.type)}
            className={`w-full text-right p-4 border rounded-lg transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${option.buttonClass}`}
          >
            <p className="font-bold">{option.title}</p>
            <p className="text-sm">{option.description}</p>
          </button>
        ))}
      </div>

      <form onSubmit={handleCustomSubmit} className="p-4 border rounded-lg bg-white border-amber-300">
         <p className="font-bold text-amber-800">4. מותאם אישית</p>
         <p className="text-sm text-slate-600 mb-2">הזן את אחוז הרווחיות הרצוי.</p>
         <div className="flex items-center gap-2">
            <input
                type="number"
                value={customMargin}
                onChange={(e) => setCustomMargin(e.target.value)}
                placeholder="למשל: 55"
                className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm text-slate-900"
                min="0"
                step="1"
            />
             <span className="text-slate-600 font-bold text-lg">%</span>
            <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-amber-600 transition-colors">
                החל
            </button>
         </div>
      </form>
    </div>
  );
};

export default MarketAdjustmentSelector;