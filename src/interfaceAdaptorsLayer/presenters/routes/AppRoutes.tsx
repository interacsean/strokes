import { Routes, Route } from 'react-router-dom';
import { RoutePaths } from './RoutePaths';
import { MainLayout } from '../components/MainLayout/MainLayout';
import { Hole } from '../screens/Hole';
import { Home } from '../screens/Home/Home';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path={RoutePaths.Hole} element={<Hole />} />
      </Route>
    </Routes>
  )
}
