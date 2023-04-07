import { last, partial } from "ramda";
import { nextHole } from "usecases/course/nextHole";
import { prevHole } from "usecases/course/prevHole";
import { saveHole } from "usecases/course/saveHole";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { useCourseState } from "state/course/courseState";
import { HoleViewProps } from "./Hole.View";
import { Hole as HoleModel } from "model/Hole";
import { setHolePar } from "usecases/hole/setHolePar";
import { mergePartStroke } from "usecases/stroke/mergePartStroke";
import { saveStroke } from "usecases/course/saveStroke";
import { Lie } from "model/Lie";
import { setStrokeLie } from "usecases/stroke/setStrokeLie";
import { Stroke } from "model/Stroke";
import { newStroke } from "usecases/stroke/newStroke";
import { mergePartHole } from "usecases/hole/mergePartHole";
import { Club } from "model/Club";
import { LatLng } from "model/LatLng";
import { useGeolocated } from "react-geolocated";
import { FakeGeo } from "./components/FakeGeo";
import { calculateStrokeDistances } from "usecases/hole/calculateStrokeDistances";
import { calculateCaddySuggestions } from "usecases/stroke/calculateCaddySuggestions";
import { selectCurrentHole } from "state/course/selectors/currentHole";
import { useSelector } from "state/utils/useSelector";

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

    const currentHole = useSelector(selectCurrentHole, courseState);

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
      // todo: this double-updates the state and it could be done in one Stroke
      saveCurrentHole(currentHole);
      nextHole(updateCourseState);
    }, [currentHole, saveCurrentHole, updateCourseState]);

    const prevHoleAndUpdate = useCallback(() => {
      saveCurrentHole(currentHole);
      prevHole(updateCourseState);
    }, [currentHole, saveCurrentHole, updateCourseState]);

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

    const strokeInputList = useMemo(
      () => shouldShowNewStroke(currentHole.strokes)
        ? [...currentHole.strokes, newStroke(currentHole.strokes.length + 1)]
        : currentHole.strokes,
      [currentHole.strokes]
    );

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
    }, [currentHole, strokeListWithDistances]);

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
