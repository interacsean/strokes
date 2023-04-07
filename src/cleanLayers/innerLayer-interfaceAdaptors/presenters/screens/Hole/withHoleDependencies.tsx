import { last, partial, set, update } from "ramda";
import { nextHole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/course/nextHole";
import { prevHole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/course/prevHole";
import { saveHole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/course/saveHole";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useCourseState } from "cleanLayers/state/courseState";
import { HoleViewProps } from "./Hole.View";
import { Hole as HoleModel } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Hole";
import { setHolePar } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/hole/setHolePar";
import { mergePartStroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/stroke/mergePartStroke";
import { saveStroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/course/saveStroke";
import { Lie } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Lie";
import { setStrokeLie } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/stroke/setStrokeLie";
import { Stroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Stroke";
import { newStroke } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/stroke/newStroke";
import { newHole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/hole/newHole";
import { mergePartHole } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/hole/mergePartHole";
import { Club } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/Club";
import { LatLng } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/innerLayer-entities/model/LatLng";
import { useGeolocated } from "react-geolocated";
import { FakeGeo } from "./components/FakeGeo";
import { calculateStrokeDistances } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/hole/calculateStrokeDistances";
import { calculateCaddySuggestions } from "cleanLayers/innerLayer-interfaceAdaptors/innerLayer-usecases/usecases/stroke/calculateCaddySuggestions";

type HolePublicProps = {};

const USE_FAKE_POSITION = true;

function shouldShowNewStroke(strokes: Stroke[]) {
  // const lastStroke = last(strokes);
  return strokes.length === 0;
}

export function withHoleDependencies(HoleView: FC<HoleViewProps>) {
  return function Hole(_props: HolePublicProps) {
    const { state: courseState, updateState: updateCourseState } =
      useCourseState();

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

    useEffect(() => {
      console.log({ currentHole });
    }, [currentHole])

    const saveStrokeAndUpdate = useCallback(
      (strokeNum: number, partStroke: Partial<Stroke>) => {
        const currentStroke =
          currentHole.strokes[strokeNum - 1] || newStroke(strokeNum);
        const strokeUpdate = mergePartStroke(currentStroke, partStroke);
        return saveStroke(updateCourseState, strokeNum, strokeUpdate);
      },
      [updateCourseState, currentHole]
    );

    const addStroke = useCallback(
      () => {
        const strokeToAdd = {
          ...newStroke(currentHole.strokes.length + 1),
          liePos: last(currentHole.strokes)?.strokePos,
        };
        saveStroke(updateCourseState, currentHole.strokes.length + 1, strokeToAdd);
      },
      [currentHole.strokes, updateCourseState],
    )

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
      [holeUpdateAndSave]
    );

    const setHolePos = useCallback(
      (holePos: LatLng) => {
        holeUpdateAndSave({ holePos });
      },
      [holeUpdateAndSave]
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
        saveStrokeAndUpdate(strokeNum, { strokePos: pos });
      },
      [saveStrokeAndUpdate]
    );

    const setLiePos = useCallback(
      (strokeNum: number, pos: LatLng) => {
        saveStrokeAndUpdate(strokeNum, { liePos: pos });
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

    // todo: retry-on loop until high accuracy – how oftern to ping
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
      setLiePos,
      currentPosition,
      caddySuggestions,
      setHolePos,
      addStroke,
    };

    return (
      <>
        <HoleView {...viewProps} />
        <FakeGeo pos={fakePos} setPos={setFakePos} />
      </>
    );
  };
}
