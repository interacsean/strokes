import { Course } from "model/Course";
import { createContext, useContext, useState, ReactNode } from "react";

export type RoundSelectionContextType = {
  selectedRounds: Course[];
  setSelectedRounds: (rounds: Course[]) => void;
  toggleRoundSelection: (round: Course) => void;
  isRoundSelected: (round: Course) => boolean;
};

const RoundSelectionContext = createContext<RoundSelectionContextType | undefined>(undefined);

export function useRoundSelection() {
  const context = useContext(RoundSelectionContext);
  if (!context) {
    throw new Error("useRoundSelection must be used within a RoundSelectionProvider");
  }
  return context;
}

export function RoundSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedRounds, setSelectedRounds] = useState<Course[]>([]);

  const toggleRoundSelection = (round: Course) => {
    setSelectedRounds(prev => {
      const isSelected = prev.some(r => r.timePlayed === round.timePlayed);
      if (isSelected) {
        return prev.filter(r => r.timePlayed !== round.timePlayed);
      } else {
        return [...prev, round];
      }
    });
  };

  const isRoundSelected = (round: Course) => {
    return selectedRounds.some(r => r.timePlayed === round.timePlayed);
  };

  return (
    <RoundSelectionContext.Provider
      value={{
        selectedRounds,
        setSelectedRounds,
        toggleRoundSelection,
        isRoundSelected,
      }}
    >
      {children}
    </RoundSelectionContext.Provider>
  );
}