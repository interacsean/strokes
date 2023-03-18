import { last, partial, set, update } from "ramda";
import { nextHole } from "interfaceAdaptorsLayer/usecaseLayer/usecases/course/nextHole";
import { prevHole } from "interfaceAdaptorsLayer/usecaseLayer/usecases/course/prevHole";
import { saveHole } from "interfaceAdaptorsLayer/usecaseLayer/usecases/course/saveHole";
import { FC, useCallback, useMemo, useState } from "react";
import { useCourseState } from "state/courseState";
import { HoleViewProps } from "./Hole.View";
import { Hole as HoleModel } from "model/Hole";
import { setHolePar } from "interfaceAdaptorsLayer/usecaseLayer/usecases/hole/setHolePar";
import { mergePartStroke } from "interfaceAdaptorsLayer/usecaseLayer/usecases/stroke/mergePartStroke";
import { saveStroke } from "interfaceAdaptorsLayer/usecaseLayer/usecases/course/saveStroke";
import { Lie } from "model/Lie";
import { setStrokeLie } from "interfaceAdaptorsLayer/usecaseLayer/usecases/stroke/setStrokeLie";
import { Stroke } from "model/Stroke";
import { newStroke } from "interfaceAdaptorsLayer/usecaseLayer/usecases/stroke/newStroke";
import { newHole } from "interfaceAdaptorsLayer/usecaseLayer/usecases/hole/newHole";
import { mergePartHole } from "interfaceAdaptorsLayer/usecaseLayer/usecases/hole/mergePartHole";
import { Club } from "model/Club";
import { LatLng } from "model/LatLng";
import { useGeolocated } from "react-geolocated";
import { FakeGeo } from "./components/FakeGeo";
import { calculateStrokeDistances } from "interfaceAdaptorsLayer/usecaseLayer/usecases/hole/calculateStrokeDistances";
import { calculateCaddySuggestions } from "interfaceAdaptorsLayer/usecaseLayer/usecases/stroke/calculateCaddySuggestions";

type HolePublicProps = {};

const USE_FAKE_POSITION = true;

function shouldShowNewStroke(strokes: Stroke[]) {
  const lastStroke = last(strokes);
  return strokes.length === 0 || (!!lastStroke?.club && !!lastStroke?.lie);
}

export function withHoleDependencies(HoleView: FC<HoleViewProps>) {
  return function Hole(_props: HolePublicProps) {
    const { state: courseState, updateState: updateCourseState } =
      useCourseState();
    console.log(courseState);

    // todo: fix memoization
    const currentHole =
      // useMemo(
      //   () =>
      courseState.holes[courseState.currentHoleNum - 1] || {
        ...newHole(),
        holeNum: courseState.currentHoleNum,
      };
    //   , [courseState, courseState.currentHoleNum],
    // );
    console.log({ currentHole });

    const saveStrokeAndUpdate = useCallback(
      (strokeNum: number, partStroke: Partial<Stroke>) => {
        const currentStroke =
          currentHole.strokes[strokeNum - 1] || newStroke(strokeNum);
        const strokeUpdate = mergePartStroke(currentStroke, partStroke);
        return saveStroke(updateCourseState, strokeNum, strokeUpdate);
      },
      [updateCourseState, currentHole]
    );

    const saveCurrentHole = useCallback(
      (h: HoleModel, n?: number) => saveHole(updateCourseState, h, n),
      [updateCourseState]
    );

    const holeUpdateAndSave = useCallback(
      (partHole: Partial<HoleModel>) =>
        saveCurrentHole(mergePartHole(currentHole, partHole)),
      [saveCurrentHole, currentHole]
    );

    const nextHoleAndUpdate = useCallback(() => {
      // this double-updates the state and it could be done in one Stroke
      saveCurrentHole(currentHole);
      nextHole(updateCourseState);
    }, [currentHole, saveCurrentHole, useCourseState]);

    const prevHoleAndUpdate = useCallback(() => {
      saveCurrentHole(currentHole);
      prevHole(updateCourseState);
    }, [currentHole, saveCurrentHole, useCourseState]);

    const setParAndUpdate = useCallback(
      (par: number) => setHolePar(holeUpdateAndSave, par),
      [saveCurrentHole]
    );

    const setStrokeLieAndUpdate = useCallback(
      (strokeNum: number, lie: Lie) => {
        const saveStrokeNumAndUpdate = partial(saveStrokeAndUpdate, [
          strokeNum,
        ]);
        setStrokeLie(saveStrokeNumAndUpdate, strokeNum, lie);
      },
      [saveStrokeAndUpdate]
    );

    const setStrokeClubAndUpdate = useCallback(
      (strokeNum: number, club: Club) =>
        saveStrokeAndUpdate(strokeNum, { club }),
      [saveStrokeAndUpdate]
    );

    const setStrokePos = useCallback(
      (strokeNum: number, pos: LatLng) => {
        saveStrokeAndUpdate(strokeNum, { ballPos: pos });
      },
      [saveStrokeAndUpdate]
    );

    const strokeInputList = shouldShowNewStroke(currentHole.strokes)
      ? [...currentHole.strokes, newStroke(currentHole.strokes.length + 1)]
      : currentHole.strokes;

    const strokeListWithDistances = useMemo(
      () => calculateStrokeDistances(currentHole, strokeInputList),
      [currentHole, strokeInputList]
    );

    const geo = useGeolocated({
      positionOptions: { enableHighAccuracy: true },
    });

    const [fakePos, setFakePos] = useState<LatLng>({
      lat: -37.8,
      lng: 144.95,
      alt: 10,
    });
    const currentPosition = USE_FAKE_POSITION
      ? fakePos
      : geo.coords?.latitude && geo.coords?.longitude
      ? {
          lat: geo.coords?.latitude,
          lng: geo.coords?.longitude,
          alt: geo.coords?.altitude,
        }
      : undefined;

    const caddySuggestions = useMemo(() => {
      const lastStroke = last(strokeListWithDistances);
      return lastStroke
        ? calculateCaddySuggestions(currentHole, lastStroke)
        : [];
    }, [currentHole, strokeInputList]);

    const viewProps = {
      nextHole: nextHoleAndUpdate,
      prevHole: prevHoleAndUpdate,
      hole: currentHole,
      holeNum: courseState.currentHoleNum,
      setPar: setParAndUpdate,
      selectStrokeLie: setStrokeLieAndUpdate,
      selectStrokeClub: setStrokeClubAndUpdate,
      strokeInputList: strokeListWithDistances,
      setStrokePos,
      currentPosition,
      caddySuggestions,
    };

    return (
      <>
        <HoleView {...viewProps} />
        <FakeGeo pos={fakePos} setPos={setFakePos} />
      </>
    );
  };
}
