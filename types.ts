export enum AppStep {
  GREETING,
  CLIENT_DETAILS,
  INPUT_FORM,
  MARKET_SELECT,
  RESULTS,
}

export enum MarketSituation {
  Standard = 'Standard',
  Premium = 'Premium',
  Competitive = 'Competitive',
  Custom = 'Custom',
}

export interface ClientDetails {
  businessName: string;
  email: string;
  address: string;
  phone: string;
}

export interface QuoteInput {
  workshopName: string;
  participants: number;
  distance: number;
  prepHours: number;
  workshopHours: number;
  estimatedWoodMeters: number;
  hasAssistant: boolean;
}

export interface CalculationResult {
  laborCost: number;
  travelCost: number;
  materialsCost: number;
  assistantCost: number;
  totalCost: number;
  profitMargin: number;
  profitAmount: number;
  finalPrice: number;
  finalPriceWithVAT: number;
}
