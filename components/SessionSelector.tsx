'use client';

import { TradingSessionType } from '@/lib/types';
import { getAllSessions } from '@/lib/sessionTimes';

interface SessionSelectorProps {
  selected: TradingSessionType;
  onChange: (session: TradingSessionType) => void;
}

const SessionSelector = ({ selected, onChange }: SessionSelectorProps) => {
  const sessions = getAllSessions();

  // Helper function to format time
  const formatTime = (hour: number, minute: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute > 0 ? `:${minute.toString().padStart(2, '0')}` : '';
    return `${displayHour}${displayMinute} ${period}`;
  };

  // Helper function to convert ET to Geneva time (CET/CEST)
  // Geneva is UTC+1 (CET) or UTC+2 (CEST), ET is UTC-5 (EST) or UTC-4 (EDT)
  // Difference is typically +6 hours
  const convertToGenevaTime = (etHour: number, etMinute: number): { hour: number; minute: number } => {
    const totalMinutes = etHour * 60 + etMinute + (6 * 60); // Add 6 hours
    const genevaHour = Math.floor(totalMinutes / 60) % 24;
    const genevaMinute = totalMinutes % 60;
    return { hour: genevaHour, minute: genevaMinute };
  };

  // Get session hours string with Geneva time
  const getSessionHours = (session: typeof sessions[0]): { genevaTime: string; etTime: string } => {
    const startGeneva = convertToGenevaTime(session.startHour, session.startMinute);
    const endGeneva = convertToGenevaTime(session.endHour, session.endMinute);
    
    const genevaStartTime = formatTime(startGeneva.hour, startGeneva.minute);
    const genevaEndTime = formatTime(endGeneva.hour, endGeneva.minute);
    
    const etStartTime = formatTime(session.startHour, session.startMinute);
    const etEndTime = formatTime(session.endHour, session.endMinute);
    
    return {
      genevaTime: `${genevaStartTime} - ${genevaEndTime}`,
      etTime: `${etStartTime} - ${etEndTime} ET`
    };
  };

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex flex-row items-center justify-center gap-1.5 min-[400px]:gap-2 sm:gap-3 px-2 min-w-max">
        {sessions.map((session) => {
          const isSelected = selected === session.type;
          const hours = getSessionHours(session);
          
          // Short name for very small screens
          const shortName = session.name === 'New York' ? 'NY' : session.name === 'London' ? 'LDN' : session.name;
          
          return (
            <button
              key={session.type}
              type="button"
              onClick={() => onChange(session.type)}
              className={`
                flex-shrink-0 px-2 min-[400px]:px-3 sm:px-4 py-1.5 sm:py-2 
                text-xs sm:text-sm font-medium border-2 rounded 
                transition-colors touch-manipulation text-center
                ${
                  isSelected
                    ? 'border-blue-600 text-blue-600 bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:bg-blue-900/20'
                    : 'border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 active:text-gray-950 dark:border-gray-600 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                }
              `}
              aria-pressed={isSelected}
              aria-label={`Select ${session.name}`}
            >
              <div className="flex flex-col gap-0.5">
                {/* Session name - short on very small screens */}
                <span className="font-semibold">
                  <span className="hidden min-[400px]:inline">{session.name}</span>
                  <span className="min-[400px]:hidden">{shortName}</span>
                </span>
                
                {/* Geneva time - always visible but smaller on mobile */}
                <span className="text-[10px] min-[400px]:text-xs sm:text-sm font-medium whitespace-nowrap">
                  {hours.genevaTime}
                </span>
                
                {/* ET time - hidden on very small screens */}
                <span className="hidden min-[400px]:inline text-[9px] sm:text-[10px] opacity-60 whitespace-nowrap">
                  {hours.etTime}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SessionSelector;

