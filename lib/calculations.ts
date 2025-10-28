import { OHLCVData, InitialBalance, TradingSessionType } from './types';
import { getSessionStartTime } from './sessionTimes';

// Calculate Initial Balance for 1 hour
export const calculateIB1H = (
  data: OHLCVData[],
  sessionDate: Date,
  session: TradingSessionType
): { high: number; low: number; range: number } => {
  const sessionStart = getSessionStartTime(sessionDate, session);
  const oneHourLater = new Date(sessionStart.getTime() + 60 * 60 * 1000);

  const ibData = data.filter((d) => {
    const time = d.date.getTime();
    return time >= sessionStart.getTime() && time < oneHourLater.getTime();
  });

  if (ibData.length === 0) {
    return { high: 0, low: 0, range: 0 };
  }

  const high = Math.max(...ibData.map((d) => d.high));
  const low = Math.min(...ibData.map((d) => d.low));
  const range = high - low;

  return { high, low, range };
};

// Calculate Initial Balance for 15 minutes
export const calculateIB15Min = (
  data: OHLCVData[],
  sessionDate: Date,
  session: TradingSessionType
): { high: number; low: number; range: number } => {
  const sessionStart = getSessionStartTime(sessionDate, session);
  const fifteenMinLater = new Date(sessionStart.getTime() + 15 * 60 * 1000);

  const ibData = data.filter((d) => {
    const time = d.date.getTime();
    return time >= sessionStart.getTime() && time < fifteenMinLater.getTime();
  });

  if (ibData.length === 0) {
    return { high: 0, low: 0, range: 0 };
  }

  const high = Math.max(...ibData.map((d) => d.high));
  const low = Math.min(...ibData.map((d) => d.low));
  const range = high - low;

  return { high, low, range };
};

// Calculate both Initial Balances
export const calculateInitialBalance = (
  data: OHLCVData[],
  sessionDate: Date,
  session: TradingSessionType
): InitialBalance => {
  const ib1h = calculateIB1H(data, sessionDate, session);
  const ib15m = calculateIB15Min(data, sessionDate, session);

  return {
    ib1hHigh: ib1h.high,
    ib1hLow: ib1h.low,
    ib1hRange: ib1h.range,
    ib15mHigh: ib15m.high,
    ib15mLow: ib15m.low,
    ib15mRange: ib15m.range,
  };
};

// Get daily open and close for a session
export const getSessionOpenClose = (
  data: OHLCVData[],
  sessionDate: Date,
  session: TradingSessionType
): { open: number; close: number; high: number; low: number } => {
  const sessionStart = getSessionStartTime(sessionDate, session);

  const sessionData = data.filter((d) => {
    const daysDiff = Math.floor(
      (d.date.getTime() - sessionStart.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysDiff === 0;
  });

  if (sessionData.length === 0) {
    return { open: 0, close: 0, high: 0, low: 0 };
  }

  const sortedData = sessionData.sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return {
    open: sortedData[0].open,
    close: sortedData[sortedData.length - 1].close,
    high: Math.max(...sessionData.map((d) => d.high)),
    low: Math.min(...sessionData.map((d) => d.low)),
  };
};

