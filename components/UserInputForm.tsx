import React, { useState } from 'react';
import { QuoteInput } from '../types';

interface UserInputFormProps {
  onSubmit: (data: QuoteInput) => void;
  initialData?: QuoteInput | null;
}

const workshopOptions = [
  "מכונת ממתקים מעץ",
  "סדנת בניית מנורת שולחן",
  "סדנת רובוטים",
  "קוביות מדברות",
  "מסגרת לתמונה",
  "מתלה מפתחות משרדי",
  "סלסלה שהופכת לשולחן",
  "סדנת באלנס בורד",
];

const UserInputForm: React.FC<UserInputFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<QuoteInput>(initialData || {
    workshopName: workshopOptions[0],
    participants: 10,
    distance: 20,
    prepHours: 1,
    workshopHours: 2,
    estimatedWoodMeters: 5,
    hasAssistant: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Participants
    if (formData.participants < 1 || formData.participants > 50) {
        newErrors.participants = "יש להזין בין 1 ל-50 משתתפים.";
    }

    // Distance
    if (formData.distance < 0 || formData.distance > 500) {
        newErrors.distance = "המרחק חייב להיות בין 0 ל-500 ק\"מ.";
    }

    // Estimated Wood Meters
    if (formData.estimatedWoodMeters < 0 || formData.estimatedWoodMeters > 200) {
        newErrors.estimatedWoodMeters = "אורך העץ חייב להיות בין 0 ל-200 מטר.";
    }
    
    // Prep Hours
    if (formData.prepHours < 0 || formData.prepHours > 40) {
        newErrors.prepHours = "שעות ההכנה חייבות להיות בין 0 ל-40.";
    }

    // Workshop Hours
    if (formData.workshopHours < 0.5 || formData.workshopHours > 12) {
        newErrors.workshopHours = "שעות הסדנה חייבות להיות בין 0.5 ל-12.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: (name === 'workshopName') ? value : Number(value) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
        onSubmit(formData);
    }
  };
  
  const getInputClasses = (fieldName: keyof QuoteInput) => {
      const baseClasses = "mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm sm:text-sm text-slate-900";
      if (errors[fieldName]) {
          return `${baseClasses} border-red-500 focus:outline-none focus:ring-red-500 focus:border-red-500`;
      }
      return `${baseClasses} border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border border-slate-200 rounded-lg">
      <div>
        <label htmlFor="workshopName" className="block text-sm font-medium text-slate-700 mb-1">1. בחר סדנה</label>
        <select
          id="workshopName"
          name="workshopName"
          value={formData.workshopName}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900"
        >
          {workshopOptions.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="participants" className="block text-sm font-medium text-slate-700">2. מספר משתתפים</label>
          <input
            type="number"
            id="participants"
            name="participants"
            value={formData.participants}
            onChange={handleChange}
            min="1"
            max="50"
            className={getInputClasses('participants')}
            required
          />
          {errors.participants && <p className="text-red-600 text-xs mt-1">{errors.participants}</p>}
        </div>
        <div>
          <label htmlFor="distance" className="block text-sm font-medium text-slate-700">3. מרחק בק"מ (כיוון אחד)</label>
          <input
            type="number"
            id="distance"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            min="0"
            max="500"
            className={getInputClasses('distance')}
            required
          />
          {errors.distance && <p className="text-red-600 text-xs mt-1">{errors.distance}</p>}
        </div>
         <div>
          <label htmlFor="estimatedWoodMeters" className="block text-sm font-medium text-slate-700">4. אורך עץ (במטרים)</label>
          <input
            type="number"
            id="estimatedWoodMeters"
            name="estimatedWoodMeters"
            value={formData.estimatedWoodMeters}
            onChange={handleChange}
            min="0"
            max="200"
            step="1"
            className={getInputClasses('estimatedWoodMeters')}
            required
          />
          {errors.estimatedWoodMeters && <p className="text-red-600 text-xs mt-1">{errors.estimatedWoodMeters}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">5. זמן עבודת נגרות (שעות)</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-1">
          <div>
              <label htmlFor="prepHours" className="block text-xs font-medium text-slate-500">שעות הכנה</label>
              <input
                type="number"
                id="prepHours"
                name="prepHours"
                value={formData.prepHours}
                onChange={handleChange}
                min="0"
                max="40"
                step="0.5"
                className={getInputClasses('prepHours')}
                required
              />
              {errors.prepHours && <p className="text-red-600 text-xs mt-1">{errors.prepHours}</p>}
          </div>
          <div>
              <label htmlFor="workshopHours" className="block text-xs font-medium text-slate-500">שעות סדנה בפועל</label>
              <input
                type="number"
                id="workshopHours"
                name="workshopHours"
                value={formData.workshopHours}
                onChange={handleChange}
                min="0.5"
                max="12"
                step="0.5"
                className={getInputClasses('workshopHours')}
                required
              />
              {errors.workshopHours && <p className="text-red-600 text-xs mt-1">{errors.workshopHours}</p>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start">
        <input
            id="hasAssistant"
            name="hasAssistant"
            type="checkbox"
            checked={formData.hasAssistant}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <label htmlFor="hasAssistant" className="mr-2 block text-sm font-medium text-slate-700">6. הוספת עובד לסדנה</label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        חשב עלויות בסיס
      </button>
    </form>
  );
};

export default UserInputForm;
