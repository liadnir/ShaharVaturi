import React, { useState, useCallback } from 'react';
import { AppStep, ClientDetails, QuoteInput, CalculationResult, MarketSituation } from './types';
import { PREP_RATE_HOURLY, WORKSHOP_RATE_HOURLY, TRAVEL_COST_PER_KM, WOOD_PRICE_PER_METER, ASSISTANT_RATE_PER_WORKSHOP_HOUR, DEFAULT_PROFIT_MARGIN, VAT_RATE } from './constants';
import UserInputForm from './components/UserInputForm';
import MarketAdjustmentSelector from './components/MarketAdjustmentSelector';
import InternalBreakdown from './components/InternalBreakdown';
import ClientQuote from './components/ClientQuote';
import Gemini from './components/Gemini';
import ClientDetailsForm from './components/ClientDetailsForm';
import { BackArrowIcon } from './components/icons/BackArrowIcon';
import { generateQuotePDF } from './utils/pdfGenerator';

const App: React.FC = () => {
  const [appStep, setAppStep] = useState<AppStep>(AppStep.GREETING);
  const [clientDetails, setClientDetails] = useState<ClientDetails | null>(null);
  const [quoteInput, setQuoteInput] = useState<QuoteInput | null>(null);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);

  const calculateQuote = useCallback((input: QuoteInput, profitMargin: number): CalculationResult => {
    const laborCost = (input.prepHours * PREP_RATE_HOURLY) + (input.workshopHours * WORKSHOP_RATE_HOURLY);
    const travelCost = input.distance * TRAVEL_COST_PER_KM * 2; // Round trip
    const materialsCost = input.estimatedWoodMeters * WOOD_PRICE_PER_METER;
    const assistantCost = input.hasAssistant ? input.workshopHours * ASSISTANT_RATE_PER_WORKSHOP_HOUR : 0;
    
    const totalCost = laborCost + travelCost + materialsCost + assistantCost;
    const profitAmount = totalCost * profitMargin;
    const finalPrice = totalCost + profitAmount;
    const finalPriceWithVAT = finalPrice * (1 + VAT_RATE);
    
    return {
      laborCost,
      travelCost,
      materialsCost,
      assistantCost,
      totalCost,
      profitMargin,
      profitAmount,
      finalPrice,
      finalPriceWithVAT,
    };
  }, []);

  const handleClientDetailsSubmit = (data: ClientDetails) => {
    setClientDetails(data);
    setAppStep(AppStep.INPUT_FORM);
  };
  
  const handleQuoteInputSubmit = (data: QuoteInput) => {
    setQuoteInput(data);
    const result = calculateQuote(data, DEFAULT_PROFIT_MARGIN);
    setCalculationResult(result);
    setAppStep(AppStep.MARKET_SELECT);
  };
  
  const handleMarketSelect = (situation: MarketSituation, customMargin?: number) => {
    if (!quoteInput) return;
    
    let profitMargin = DEFAULT_PROFIT_MARGIN;
    
    switch (situation) {
      case MarketSituation.Premium:
        profitMargin += 0.20;
        break;
      case MarketSituation.Competitive:
        profitMargin -= 0.10;
        break;
      case MarketSituation.Custom:
        if (customMargin !== undefined) {
          profitMargin = customMargin;
        }
        break;
      case MarketSituation.Standard:
      default:
        profitMargin = DEFAULT_PROFIT_MARGIN;
        break;
    }
    
    const result = calculateQuote(quoteInput, profitMargin);
    setCalculationResult(result);
    setAppStep(AppStep.RESULTS);
  };

  const handleBack = () => {
    if (appStep === AppStep.RESULTS) {
      setAppStep(AppStep.MARKET_SELECT);
    } else if (appStep === AppStep.MARKET_SELECT) {
      setAppStep(AppStep.INPUT_FORM);
    } else if (appStep === AppStep.INPUT_FORM) {
      setAppStep(AppStep.CLIENT_DETAILS);
    } else if (appStep === AppStep.CLIENT_DETAILS) {
        setAppStep(AppStep.GREETING);
    }
  };
  
  const handleRestart = () => {
    setAppStep(AppStep.GREETING);
    setClientDetails(null);
    setQuoteInput(null);
    setCalculationResult(null);
  };

  const handleDownloadPDF = () => {
    if (clientDetails && quoteInput && calculationResult) {
      generateQuotePDF(clientDetails, quoteInput, calculationResult);
    }
  };

  const renderStep = () => {
    switch (appStep) {
      case AppStep.GREETING:
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold text-slate-700 mb-6">נגר על הבוקר</h2>
            <h1 className="text-4xl font-extrabold text-slate-800 mb-2">מחשבון הצעות מחיר</h1>
            <p className="text-lg text-slate-600 mb-8">כלי חכם ומהיר ליצירת הצעות מחיר לסדנאות נגרות.</p>
            <button
              onClick={() => setAppStep(AppStep.CLIENT_DETAILS)}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg transform hover:scale-105"
            >
              התחל
            </button>
          </div>
        );
      case AppStep.CLIENT_DETAILS:
        return (
           <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">שלב 1: פרטי הלקוח</h2>
              <p className="text-slate-600 mb-4">מידע זה ישמש ליצירת הצעת המחיר הסופית.</p>
              <ClientDetailsForm onSubmit={handleClientDetailsSubmit} initialData={clientDetails} />
           </div>
        );
      case AppStep.INPUT_FORM:
        return (
           <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">שלב 2: פרטי הסדנה</h2>
              <p className="text-slate-600 mb-4">הזן את כל המשתנים לחישוב עלויות הבסיס.</p>
              <UserInputForm onSubmit={handleQuoteInputSubmit} initialData={quoteInput} />
           </div>
        );
      case AppStep.MARKET_SELECT:
        return (
           <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-1">שלב 3: התאמה ללקוח</h2>
              <p className="text-slate-600 mb-4">בחר את אחוז הרווחיות בהתאם לאופי הלקוח והשוק.</p>
              <MarketAdjustmentSelector onSelect={handleMarketSelect} />
           </div>
        );
      case AppStep.RESULTS:
        if (quoteInput && calculationResult && clientDetails) {
          return (
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 text-center">הצעת המחיר מוכנה!</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <ClientQuote 
                      clientDetails={clientDetails}
                      input={quoteInput} 
                      result={calculationResult} 
                      onRestart={handleRestart}
                      onDownloadPDF={handleDownloadPDF}
                    />
                    <Gemini />
                </div>
                <div>
                   <InternalBreakdown input={quoteInput} result={calculationResult} />
                </div>
              </div>
            </div>
          );
        }
        return <p>טוען תוצאות...</p>;
      default:
        return <p>שלב לא ידוע.</p>;
    }
  };

  return (
    <div dir="rtl" className="bg-slate-100 min-h-screen font-sans text-slate-800">
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
         {appStep > AppStep.GREETING && (
            <button onClick={handleBack} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold mb-4 transition-colors group">
                <div className="transform transition-transform group-hover:-translate-x-1">
                    <BackArrowIcon />
                </div>
                <span>חזור</span>
            </button>
        )}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          {renderStep()}
        </div>
         <footer className="text-center mt-8 text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} נגר על הבוקר. פותח באהבה כדי לחסוך זמן.</p>
        </footer>
      </main>
    </div>
  );
};

export default App;