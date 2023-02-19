import { partial } from 'ramda';
import { nextHole } from 'interfaceAdaptorsLayer/usecaseLayer/usecases/course/nextHole';
import { prevHole } from 'interfaceAdaptorsLayer/usecaseLayer/usecases/course/prevHole';
import { saveHole } from 'interfaceAdaptorsLayer/usecaseLayer/usecases/hole/saveHole';
import { FC, useCallback, useMemo, useState } from 'react';
import { useCourseState } from 'state/courseState';
import { HoleViewProps } from './Hole.View';

type HolePublicProps = {
}

export function withDependencies(HoleView: FC<HoleViewProps>) {
  return function Hole(_props: HolePublicProps) {
    const { state: courseState, updateState: updateCourseState } = useCourseState();

    const hole = useMemo(
      () => courseState.holes[courseState.currentHoleNum - 1],
      [courseState.holes, courseState.currentHoleNum],
    );

    const { 
      saveHoleUpdate, 
      nextHoleUpdate,
      prevHoleUpdate,
     } = useMemo(() => ({
      saveHoleUpdate: partial(saveHole, [updateCourseState]),
      nextHoleUpdate: () => nextHole(updateCourseState),
      prevHoleUpdate: () => prevHole(updateCourseState),
    }), []);

    const viewProps = {
      nextHole: useCallback(() => {
        saveHoleUpdate(hole, courseState.currentHoleNum);
        nextHoleUpdate();
      }, [hole, courseState.currentHoleNum]),
      prevHole: useCallback(() => {
        saveHoleUpdate(hole, courseState.currentHoleNum);
        prevHoleUpdate();
      }, [hole, courseState.currentHoleNum]),
      hole,
      holeNum: courseState.currentHoleNum,
    };

    return (
      <HoleView {...viewProps} />
    )
  }
}
