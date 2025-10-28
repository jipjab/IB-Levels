export type InstrumentSymbol = 'ES' | 'MES' | 'NQ' | 'MNQ' | 'GC' | 'MGC' | 'CL' | 'MCL';

export type TradingSessionType = 'Asia' | 'London' | 'NewYork';

export interface Instrument {
  symbol: InstrumentSymbol;
  name: string;
  yahooTicker: string;
  description: string;
  type: 'mini' | 'micro';
}

export interface TradingSession {
  type: TradingSessionType;
  name: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface OHLCVData {
  timestamp: number;
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface InitialBalance {
  ib1hHigh: number;
  ib1hLow: number;
  ib1hRange: number;
  ib15mHigh: number;
  ib15mLow: number;
  ib15mRange: number;
}

export interface TradingLevel {
  date: string;
  session: TradingSessionType;
  instrument: InstrumentSymbol;
  open: number;
  close: number;
  high: number;
  low: number;
  volume?: number;
  initialBalance: InitialBalance;
}

export interface ChartData extends OHLCVData {
  time: number;
}

export interface APIResponse {
  success: boolean;
  data?: TradingLevel[];
  error?: string;
}

