import { useAppContext } from 'interfaceAdaptorsLayer/presenters/appContext/appContext';
import { FC, useCallback } from 'react';
import { HoleViewProps } from './Hole.View';

type HolePublicProps = {
}

export function withDependencies(Component: FC<HoleViewProps>) {
  return function Hole(props: HolePublicProps) {
    const courseState = useAppContext().useCourseState();

    const viewProps = {
      nextHole: useCallback(
        () => courseState.setCurrentHole(Math.min(18, courseState.currentHoleNum + 1)),
        [courseState.currentHoleNum]
      ),
      prevHole: useCallback(
        () => courseState.setCurrentHole(Math.max(1, courseState.currentHoleNum - 1)),
        [courseState.currentHoleNum]
      ),
      hole: courseState.currentHole,
      holeNum: courseState.currentHoleNum,
    }
    return (
      <Component {...viewProps} />
    )
  }
}
