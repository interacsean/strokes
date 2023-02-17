import { useAppContext } from 'interfaceAdaptorsLayer/presenters/appContext/appContext';
import { makeNextHole } from 'interfaceAdaptorsLayer/usecaseLayer/usecases/course/nextHole';
import { makePrevHole } from 'interfaceAdaptorsLayer/usecaseLayer/usecases/course/prevHole';
import { createHole } from 'interfaceAdaptorsLayer/usecaseLayer/usecases/hole/createHole';
import { makeSaveHole } from 'interfaceAdaptorsLayer/usecaseLayer/usecases/hole/saveHole';
import { FC, useCallback, useMemo, useState } from 'react';
import { HoleViewProps } from './Hole.View';

type HolePublicProps = {
}

export function withDependencies(Component: FC<HoleViewProps>) {
  return function Hole(props: HolePublicProps) {
    const { state: courseState, updateState: updateCourseState } = useAppContext().useCourseState();
    const { 
      saveHole, 
      nextHole,
      prevHole,
     } = useMemo(() => ({
      saveHole: makeSaveHole(updateCourseState),
      nextHole: makeNextHole(updateCourseState),
      prevHole: makePrevHole(updateCourseState),
    }), []);
    const [hole, setHole] = useState(createHole(courseState.currentHoleNum));

    const viewProps = {
      nextHole: useCallback(() => {
        saveHole(hole);
        nextHole();
      }, [hole]),
      prevHole: useCallback(() => {
        saveHole(hole);
        prevHole();
      }, [hole]),
      hole: courseState.holes[courseState.currentHoleNum - 1],
      holeNum: courseState.currentHoleNum,
    }
    return (
      <Component {...viewProps} />
    )
  }
}
