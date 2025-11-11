import React, { useState, useCallback, useMemo } from 'react';
import { QuoteInput, CalculationResult, MarketSituation, AppStep, ClientDetails } from './types';
import { PREP_RATE_HOURLY, WORKSHOP_RATE_HOURLY, TRAVEL_COST_PER_KM, WOOD_PRICE_PER_KG, ASSISTANT_RATE_PER_WORKSHOP_HOUR, DEFAULT_PROFIT_MARGIN, VAT_RATE } from './constants';
import ClientDetailsForm from './components/ClientDetailsForm';
import UserInputForm from './components/UserInputForm';
import MarketAdjustmentSelector from './components/MarketAdjustmentSelector';
import InternalBreakdown from './components/InternalBreakdown';
import ClientQuote from './components/ClientQuote';
import Gemini from './components/Gemini';
import { RestartIcon } from './components/icons/RestartIcon';
import { BackArrowIcon } from './components/icons/BackArrowIcon';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.GREETING);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [quoteInput, setQuoteInput] = useState<QuoteInput | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const handleStart = () => {
    setStep(AppStep.CLIENT_DETAILS);
    setClientDetails(null);
    setQuoteInput(null);
    setCalculationResult(null);
  };

  const handleClientDetailsSubmit = useCallback((data: ClientDetails) => {
    setClientDetails(data);
    setStep(AppStep.INPUT_FORM);
  }, []);

  const handleFormSubmit = useCallback((data: QuoteInput) => {
    setQuoteInput(data);
    setStep(AppStep.MARKET_SELECT);
  }, []);

  const handleMarketSelect = useCallback((situation: MarketSituation, customMargin?: number) => {
    if (!quoteInput) return;

    let adjustedMargin = DEFAULT_PROFIT_MARGIN;
    if (situation === MarketSituation.Premium) {
      adjustedMargin *= 1.20;
    } else if (situation === MarketSituation.Competitive) {
      adjustedMargin *= 0.90; 
    } else if (situation === MarketSituation.Custom && customMargin !== undefined) {
      adjustedMargin = customMargin;
    }

    const laborCost = (quoteInput.prepHours * PREP_RATE_HOURLY) + (quoteInput.workshopHours * WORKSHOP_RATE_HOURLY);
    const travelCost = (quoteInput.distance * 2) * TRAVEL_COST_PER_KM;
    const materialsCost = quoteInput.estimatedWoodKg * WOOD_PRICE_PER_KG;
    const assistantCost = quoteInput.hasAssistant ? quoteInput.workshopHours * ASSISTANT_RATE_PER_WORKSHOP_HOUR : 0;
    
    const totalCost = laborCost + travelCost + materialsCost + assistantCost;
    const profitAmount = totalCost * adjustedMargin;
    const finalPrice = totalCost + profitAmount;
    const finalPriceWithVAT = finalPrice * (1 + VAT_RATE);
    
    setCalculationResult({
      laborCost,
      travelCost,
      materialsCost,
      assistantCost,
      totalCost,
      profitMargin: adjustedMargin,
      profitAmount,
      finalPrice,
      finalPriceWithVAT,
    });

    setStep(AppStep.RESULTS);
  }, [quoteInput]);
  
  const handleBack = () => {
    if (step === AppStep.CLIENT_DETAILS) {
      setStep(AppStep.GREETING);
    } else if (step === AppStep.INPUT_FORM) {
        setStep(AppStep.CLIENT_DETAILS);
    } else if (step === AppStep.MARKET_SELECT) {
        setStep(AppStep.INPUT_FORM);
    } else if (step === AppStep.RESULTS) {
        setStep(AppStep.MARKET_SELECT);
    }
  };

  const confirmationMessage = useMemo(() => {
    if (!quoteInput) return '';
    const totalTravel = quoteInput.distance * 2;
    const totalHours = quoteInput.prepHours + quoteInput.workshopHours;
    return `הבנתי. אז זה ${quoteInput.participants} משתתפים, ${totalTravel} ק"מ סה"כ נסיעה, ו-${totalHours} שעות עבודה כולל. מתחיל חישוב...`;
  }, [quoteInput]);

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">הצעות מחיר - עץ השחר</h1>
          <p className="text-slate-600 mt-2">העוזר האישי שלך להכנת הצעות מחיר מהירות ומדויקות</p>
        </header>

        <main className="bg-white rounded-xl shadow-lg p-6 md:p-8 space-y-6 relative">
          {step > AppStep.GREETING && (
            <button
                onClick={handleBack}
                className="absolute top-6 left-6 text-slate-500 hover:text-slate-800 transition-colors p-2 rounded-full hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-label="חזור אחורה"
            >
                <BackArrowIcon />
            </button>
          )}

          {step === AppStep.GREETING && (
            <div className="text-center">
              <p className="text-lg text-slate-700 mb-6">היי שחר, בוא נכין הצעת מחיר חדשה.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleStart}
                  className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  התחל הצעת מחיר חדשה
                </button>
              </div>
            </div>
          )}

          {step >= AppStep.CLIENT_DETAILS && step < AppStep.RESULTS && (
            <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-bold text-slate-700">שלב 1: פרטי הלקוח</h3>
                <p className="text-sm text-slate-600">הזן את פרטי הלקוח עבור הצעת המחיר.</p>
            </div>
          )}
          
          {step === AppStep.CLIENT_DETAILS && <ClientDetailsForm onSubmit={handleClientDetailsSubmit} initialData={clientDetails} />}


          {step >= AppStep.INPUT_FORM && step < AppStep.RESULTS && (
            <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-bold text-slate-700">שלב 2: פרטי הסדנה</h3>
                <p className="text-sm text-slate-600">אני אצטרך ממך כמה פרטים כדי להתחיל:</p>
            </div>
          )}

          {step === AppStep.INPUT_FORM && <UserInputForm onSubmit={handleFormSubmit} initialData={quoteInput} />}

          {step >= AppStep.MARKET_SELECT && quoteInput && (
             <div className="p-4 bg-blue-50 border-r-4 border-blue-500 rounded-r-lg">
                <p className="text-slate-800">{confirmationMessage}</p>
             </div>
          )}

          {step >= AppStep.MARKET_SELECT && step < AppStep.RESULTS && (
            <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-bold text-slate-700">שלב 3: התאמה לשוק</h3>
                <p className="text-sm text-slate-600">חישבתי את עלות הבסיס שלך. עכשיו בחר את שיעור הרווח הרצוי:</p>
            </div>
          )}

          {step === AppStep.MARKET_SELECT && <MarketAdjustmentSelector onSelect={handleMarketSelect} />}

          {step === AppStep.RESULTS && clientDetails && quoteInput && calculationResult && (
            <>
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-bold text-slate-700">שלב 4: סיכום ותוצרים</h3>
                <p className="text-sm text-slate-600">הצעת המחיר חושבה בהצלחה. להלן הפירוט:</p>
              </div>
              <InternalBreakdown input={quoteInput} result={calculationResult} />
              <ClientQuote clientDetails={clientDetails} input={quoteInput} result={calculationResult} />
              <div className="mt-6 pt-6 border-t border-slate-200">
                <Gemini />
              </div>
              <div className="text-center pt-4 mt-6 border-t border-slate-200">
                <button
                  onClick={handleStart}
                  className="bg-gray-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center justify-center gap-2 mx-auto"
                >
                  <RestartIcon />
                  הכן הצעת מחיר נוספת
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;