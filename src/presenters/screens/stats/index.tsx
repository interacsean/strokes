import { Routes, Route } from "react-router-dom";
import { StatsView } from "./Stats.view";
import { FairwaysGreensHit } from "./FairwaysGreensHit";
import { ClubDistances } from "./ClubDistances";
import { ClubStrike } from "./ClubStrike";
import { GreensInRange } from "./GreensInRange";
import { RoundSelectionProvider } from "./components/RoundSelectionProvider";

export function Stats() {
  return (
    <RoundSelectionProvider>
      <Routes>
        <Route index element={<StatsView />} />
        <Route path="fairways-greens" element={<FairwaysGreensHit />} />
        <Route path="club-distances" element={<ClubDistances />} />
        <Route path="club-strike" element={<ClubStrike />} />
        <Route path="greens-in-range" element={<GreensInRange />} />
      </Routes>
    </RoundSelectionProvider>
  );
}