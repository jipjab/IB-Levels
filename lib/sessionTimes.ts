import { TradingSession, TradingSessionType } from './types';

// Trading session times in ET (Eastern Time)
// Note: ETF data is only available during US market hours (9:30 AM - 4:00 PM ET)
// For pre-market and extended hours, data may be limited or unavailable
export const TRADING_SESSIONS: Record<TradingSessionType, TradingSession> = {
  Asia: {
    type: 'Asia',
    name: 'Asia Session',
    startHour: 18, // 6:00 PM ET (previous day close)
    startMinute: 0,
    endHour: 3, // 3:00 AM ET (before London open)
    endMinute: 0,
  },
  London: {
    type: 'London',
    name: 'London Session',
    startHour: 4, // 4:00 AM ET (pre-market begins)
    startMinute: 0,
    endHour: 11, // 11:00 AM ET (before NY session)
    endMinute: 30,
  },
  NewYork: {
    type: 'NewYork',
    name: 'New York Session',
    startHour: 9, // 9:30 AM ET (market open)
    startMinute: 30,
    endHour: 16, // 4:00 PM ET (market close)
    endMinute: 0,
  },
};

export const getAllSessions = (): TradingSession[] => {
  return Object.values(TRADING_SESSIONS);
};

export const getSession = (type: TradingSessionType): TradingSession => {
  return TRADING_SESSIONS[type];
};

// Check if a timestamp falls within a session
export const isInSession = (
  timestamp: number,
  session: TradingSessionType
): boolean => {
  const date = new Date(timestamp);
  const sessionConfig = TRADING_SESSIONS[session];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  const startMinutes =
    sessionConfig.startHour * 60 + sessionConfig.startMinute;
  const endMinutes = sessionConfig.endHour * 60 + sessionConfig.endMinute;

  // Handle sessions that cross midnight (like Asia)
  if (startMinutes > endMinutes) {
    return totalMinutes >= startMinutes || totalMinutes < endMinutes;
  }

  return totalMinutes >= startMinutes && totalMinutes < endMinutes;
};

// Get session start time for a given date
export const getSessionStartTime = (
  date: Date,
  session: TradingSessionType
): Date => {
  const sessionConfig = TRADING_SESSIONS[session];
  const startDate = new Date(date);
  startDate.setHours(sessionConfig.startHour, sessionConfig.startMinute, 0, 0);

  // For Asia session, if it starts in the evening, it might be previous day
  if (
    session === 'Asia' &&
    sessionConfig.startHour >= 18 &&
    date.getHours() < 12
  ) {
    startDate.setDate(startDate.getDate() - 1);
  }

  return startDate;
};

// Get session end time for a given date
export const getSessionEndTime = (
  date: Date,
  session: TradingSessionType
): Date => {
  const sessionConfig = TRADING_SESSIONS[session];
  const endDate = new Date(date);
  endDate.setHours(sessionConfig.endHour, sessionConfig.endMinute, 0, 0);

  // For Asia session that ends early morning, add a day
  if (session === 'Asia' && sessionConfig.endHour < 12) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return endDate;
};

