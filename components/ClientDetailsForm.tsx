import React, { useState } from 'react';
import { ClientDetails } from '../types';

interface ClientDetailsFormProps {
  onSubmit: (data: ClientDetails) => void;
  initialData?: ClientDetails | null;
}

const ClientDetailsForm: React.FC<ClientDetailsFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<ClientDetails>(initialData || {
    businessName: '',
    email: '',
    address: '',
    phone: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.businessName.trim()) {
        newErrors.businessName = "שם העסק הוא שדה חובה.";
    }

    if (!formData.email.trim()) {
        newErrors.email = "כתובת המייל היא שדה חובה.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "כתובת המייל אינה תקינה.";
    }

    if (!formData.phone.trim()) {
        newErrors.phone = "מספר טלפון הוא שדה חובה.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
        onSubmit(formData);
    }
  };
  
  const getInputClasses = (fieldName: keyof ClientDetails) => {
      const baseClasses = "mt-1 block w-full px-3 py-2 bg-white border rounded-md shadow-sm sm:text-sm text-slate-900";
      if (errors[fieldName]) {
          return `${baseClasses} border-red-500 focus:outline-none focus:ring-red-500 focus:border-red-500`;
      }
      return `${baseClasses} border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4 border border-slate-200 rounded-lg">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-slate-700">שם העסק / לקוח*</label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className={getInputClasses('businessName')}
            required
          />
          {errors.businessName && <p className="text-red-600 text-xs mt-1">{errors.businessName}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">כתובת מייל*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={getInputClasses('email')}
            required
          />
          {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700">מספר טלפון*</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={getInputClasses('phone')}
            required
          />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-slate-700">כתובת (אופציונלי)</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={getInputClasses('address')}
          />
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        המשך לפרטי הסדנה
      </button>
    </form>
  );
};

export default ClientDetailsForm;