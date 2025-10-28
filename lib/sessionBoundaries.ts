import { TradingSessionType } from './types';

// Session times in ET (Eastern Time)
const SESSION_TIMES = {
  Asia: { start: { hour: 18, minute: 0 }, end: { hour: 3, minute: 0 } }, // 6PM - 3AM
  London: { start: { hour: 3, minute: 0 }, end: { hour: 12, minute: 0 } }, // 3AM - 12PM
  NewYork: { start: { hour: 9, minute: 30 }, end: { hour: 16, minute: 0 } }, // 9:30AM - 4PM
};

/**
 * Get the next session boundary (open or close) for a given session
 */
export function getNextSessionBoundary(session: TradingSessionType): Date {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  
  const sessionTime = SESSION_TIMES[session];
  const boundaries: Date[] = [];
  
  // Create boundary times for today
  const startToday = new Date(now);
  startToday.setHours(sessionTime.start.hour, sessionTime.start.minute, 0, 0);
  
  const endToday = new Date(now);
  endToday.setHours(sessionTime.end.hour, sessionTime.end.minute, 0, 0);
  
  // Create boundary times for tomorrow
  const startTomorrow = new Date(startToday);
  startTomorrow.setDate(startTomorrow.getDate() + 1);
  
  const endTomorrow = new Date(endToday);
  endTomorrow.setDate(endTomorrow.getDate() + 1);
  
  // Add all future boundaries
  if (startToday > now) boundaries.push(startToday);
  if (endToday > now) boundaries.push(endToday);
  boundaries.push(startTomorrow);
  boundaries.push(endTomorrow);
  
  // Return the earliest future boundary
  boundaries.sort((a, b) => a.getTime() - b.getTime());
  return boundaries[0];
}

/**
 * Check if we're within N minutes of a session boundary
 */
export function isNearSessionBoundary(session: TradingSessionType, minutesThreshold: number = 5): boolean {
  const nextBoundary = getNextSessionBoundary(session);
  const now = new Date();
  const minutesUntilBoundary = (nextBoundary.getTime() - now.getTime()) / (1000 * 60);
  
  return minutesUntilBoundary <= minutesThreshold;
}

/**
 * Get time until next session boundary in minutes
 */
export function getMinutesUntilNextBoundary(session: TradingSessionType): number {
  const nextBoundary = getNextSessionBoundary(session);
  const now = new Date();
  return Math.floor((nextBoundary.getTime() - now.getTime()) / (1000 * 60));
}

/**
 * Check if a session has closed since a given timestamp
 */
export function hasSessionClosedSince(session: TradingSessionType, timestamp: number): boolean {
  const lastFetch = new Date(timestamp);
  const now = new Date();
  const sessionTime = SESSION_TIMES[session];
  
  // Get today's session close time
  const todayClose = new Date(now);
  todayClose.setHours(sessionTime.end.hour, sessionTime.end.minute, 0, 0);
  
  // Get yesterday's session close time
  const yesterdayClose = new Date(todayClose);
  yesterdayClose.setDate(yesterdayClose.getDate() - 1);
  
  // Check if a session close happened between last fetch and now
  return (lastFetch < todayClose && now >= todayClose) || 
         (lastFetch < yesterdayClose && now >= yesterdayClose);
}

/**
 * Format time until next boundary for display
 */
export function formatTimeUntilBoundary(session: TradingSessionType): string {
  const minutes = getMinutesUntilNextBoundary(session);
  
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

