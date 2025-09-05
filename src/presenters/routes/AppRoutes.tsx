import { Routes, Route } from "react-router-dom";
import { RoutePaths } from "./RoutePaths";
import { MainLayout } from "../components/MainLayout/MainLayout";
import { Hole } from "presenters/screens/Hole";
import { Home } from "presenters/screens/Home/Home";
import { PostRound } from "presenters/screens/PostRound";
import { ChooseCourse } from "presenters/screens/ChooseCourse";
import { PreviousRounds } from "presenters/screens/PreviousRounds";
import { Stats } from "presenters/screens/stats";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path={RoutePaths.Hole} element={<Hole />} />
        <Route path={RoutePaths.ChooseCourse} element={<ChooseCourse />} />
        <Route path={RoutePaths.PostRound} element={<PostRound />} />
        <Route path={RoutePaths.PreviousRounds} element={<PreviousRounds />} />
        <Route path="/stats/*" element={<Stats />} />
      </Route>
    </Routes>
  );
}
