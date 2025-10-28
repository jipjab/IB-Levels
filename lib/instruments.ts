import { Instrument, InstrumentSymbol } from './types';

export const INSTRUMENTS: Record<InstrumentSymbol, Instrument> = {
  ES: {
    symbol: 'ES',
    name: 'E-mini S&P 500',
    yahooTicker: 'ES=F',
    description: 'S&P 500 Mini Contract',
    type: 'mini',
  },
  MES: {
    symbol: 'MES',
    name: 'Micro E-mini S&P 500',
    yahooTicker: 'MES=F',
    description: 'S&P 500 Micro Contract',
    type: 'micro',
  },
  NQ: {
    symbol: 'NQ',
    name: 'E-mini Nasdaq-100',
    yahooTicker: 'NQ=F',
    description: 'Nasdaq Mini Contract',
    type: 'mini',
  },
  MNQ: {
    symbol: 'MNQ',
    name: 'Micro E-mini Nasdaq-100',
    yahooTicker: 'MNQ=F',
    description: 'Nasdaq Micro Contract',
    type: 'micro',
  },
  GC: {
    symbol: 'GC',
    name: 'Gold Futures',
    yahooTicker: 'GC=F',
    description: 'Gold Mini Contract',
    type: 'mini',
  },
  MGC: {
    symbol: 'MGC',
    name: 'Micro Gold Futures',
    yahooTicker: 'MGC=F',
    description: 'Gold Micro Contract',
    type: 'micro',
  },
  CL: {
    symbol: 'CL',
    name: 'Crude Oil Futures',
    yahooTicker: 'CL=F',
    description: 'Crude Oil Mini Contract',
    type: 'mini',
  },
  MCL: {
    symbol: 'MCL',
    name: 'Micro Crude Oil Futures',
    yahooTicker: 'MCL=F',
    description: 'Crude Oil Micro Contract',
    type: 'micro',
  },
};

export const getAllInstruments = (): Instrument[] => {
  return Object.values(INSTRUMENTS);
};

export const getInstrument = (symbol: InstrumentSymbol): Instrument => {
  return INSTRUMENTS[symbol];
};

