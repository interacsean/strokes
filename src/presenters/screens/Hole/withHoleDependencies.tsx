import { head, last, partial } from "ramda";
import { nextHole } from "usecases/course/nextHole";
import { prevHole } from "usecases/course/prevHole";
import { saveHole } from "usecases/course/saveHole";
import { FC, useCallback, useMemo, useState } from "react";
import { useCourseState } from "state/course/courseState";
import { HoleViewProps } from "./Hole.View";
import { Hole as HoleModel } from "model/Hole";
import { setHolePar } from "usecases/hole/setHolePar";
import { mergePartStroke } from "usecases/stroke/mergePartStroke";
import { saveStroke } from "usecases/course/saveStroke";
import { Lie } from "model/Lie";
import { setStrokeLie } from "usecases/stroke/setStrokeLie";
import { Stroke } from "model/Stroke";
import { newStrokeFromStrokes } from "usecases/stroke/newStrokeFromStrokes";
import { mergePartHole } from "usecases/hole/mergePartHole";
import { Club } from "model/Club";
import { LatLng } from "model/LatLng";
import { useGeolocated } from "react-geolocated";
import { FakeGeo } from "./components/FakeGeo";
import { calculateStrokeDistances } from "usecases/hole/calculateStrokeDistances";
import { calculateCaddySuggestions } from "usecases/stroke/calculateCaddySuggestions";
import { selectCurrentHole } from "state/course/selectors/currentHole";
import { useSelector } from "state/utils/useSelector";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { StrokeType } from "model/StrokeType";
import { setStrokeType } from "usecases/stroke/setStrokeType";
import { setClub } from "usecases/stroke/setClub";
import { GeoHUD } from "presenters/screens/Hole/components/GeoHUD";

type HolePublicProps = {};

const USE_FAKE_POSITION = false;

function shouldShowNewStroke(strokes: Stroke[]) {
  // const lastStroke = last(strokes);
  return strokes.length === 0;
}

export function withHoleDependencies(HoleView: FC<HoleViewProps>) {
  return function Hole(_props: HolePublicProps) {
    const { state: courseState, updateState: updateCourseState } =
      useCourseState();

    console.log(courseState);

    const currentHole = useSelector(selectCurrentHole, courseState);
    const { strokes } = currentHole;

    console.log(currentHole, strokes);

    const saveStrokeAndUpdate = useCallback(
      (strokeNum: number, partStroke: Partial<Stroke>) => {
        const currentStroke =
          currentHole.strokes[strokeNum - 1] || newStrokeFromStrokes(strokes);
        const updatedStroke = mergePartStroke(currentStroke, partStroke);
        saveStroke(updateCourseState, currentHole, strokeNum, updatedStroke);
      },
      [updateCourseState, currentHole, strokes]
    );

    const addStroke = useCallback(() => {
      const strokeToAdd = {
        ...newStrokeFromStrokes(strokes),
        liePos: last(strokes)?.strokePos,
      };
      saveStroke(
        updateCourseState,
        currentHole,
        strokes.length + 1,
        strokeToAdd
      );
    }, [strokes, currentHole, updateCourseState]);

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
        setStrokeLie(
          saveStrokeNumAndUpdate,
          strokeNum,
          strokes[strokeNum - 1],
          lie
        );
      },
      [saveStrokeAndUpdate, strokes]
    );

    const setStrokeClubAndUpdate = useCallback(
      (strokeNum: number, club: Club) => {
        const saveStrokeNumAndUpdate = partial(saveStrokeAndUpdate, [
          strokeNum,
        ]);
        setClub(
          saveStrokeNumAndUpdate,
          strokeNum,
          strokes[strokeNum - 1],
          club
        );
      },
      [saveStrokeAndUpdate, strokes]
    );

    const setStrokeTypeAndUpdate = useCallback(
      (strokeNum: number, strokeType: StrokeType) => {
        const saveStrokeNumAndUpdate = partial(saveStrokeAndUpdate, [
          strokeNum,
        ]);
        setStrokeType(
          saveStrokeNumAndUpdate,
          strokeNum,
          strokes[strokeNum - 1],
          strokeType
        );
      },
      [saveStrokeAndUpdate, strokes]
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
      () =>
        shouldShowNewStroke(currentHole.strokes)
          ? [...currentHole.strokes, newStrokeFromStrokes(currentHole.strokes)]
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
      watchPosition: true,
    });

    const [fakePos, setFakePos] = useState<LatLng>({
      lat: -37.8,
      lng: 144.95,
      alt: 10,
    });
    const currentPosition = useMemo(
      () =>
        USE_FAKE_POSITION
          ? fakePos
          : geo.coords?.latitude && geo.coords?.longitude
          ? {
              lat: geo.coords?.latitude,
              lng: geo.coords?.longitude,
              alt: geo.coords?.altitude,
            }
          : undefined,
      [fakePos, geo.coords]
    );

    const caddySuggestions = useMemo(() => {
      const lastStroke = last(strokeListWithDistances);
      return lastStroke
        ? calculateCaddySuggestions(currentHole, lastStroke)
        : [];
    }, [currentHole, strokeListWithDistances]);

    const distanceToHole = useMemo(
      () =>
        currentPosition && currentHole.holePos
          ? calculateDistanceBetweenPositions(
              currentPosition,
              currentHole.holePos
            )
          : undefined,
      [currentHole.holePos, currentPosition]
    );

    const holeAltitudeDelta = useMemo(
      () =>
        currentPosition && currentPosition.alt !== null && currentHole.holePos
          ? currentHole.holePos?.lat - currentPosition?.alt
          : undefined,
      [currentHole.holePos, currentPosition]
    );

    const holeLength = useMemo(() => {
      const chosenTeePos = head(strokeListWithDistances)?.liePos;
      return chosenTeePos && currentHole.holePos
        ? calculateDistanceBetweenPositions(chosenTeePos, currentHole.holePos)
        : undefined;
    }, [currentHole.holePos, strokeListWithDistances]);

    const roundScore = useMemo(
      () =>
        courseState.holes.reduce((scoreAcc, hole) => {
          if (hole.strokes.length && hole.completed) {
            return scoreAcc + hole.strokes.length - hole.par;
          }
          return scoreAcc;
        }, 0),
      [courseState.holes]
    );

    const viewProps: HoleViewProps = {
      nextHole: nextHoleAndUpdate,
      prevHole: prevHoleAndUpdate,
      hole: currentHole,
      holeNum: courseState.currentHoleNum,
      setPar: setParAndUpdate,
      selectStrokeLie: setStrokeLieAndUpdate,
      selectStrokeClub: setStrokeClubAndUpdate,
      selectStrokeType: setStrokeTypeAndUpdate,
      strokeInputList: strokeListWithDistances,
      setStrokePos,
      setLiePos,
      currentPosition,
      caddySuggestions,
      setHolePos,
      addStroke,
      distanceToHole,
      holeAltitudeDelta,
      holeLength,
      roundScore,
    };

    return (
      <>
        <HoleView {...viewProps} />
        {USE_FAKE_POSITION ? (
          <FakeGeo pos={fakePos} setPos={setFakePos} />
        ) : (
          <GeoHUD currentPosition={currentPosition} geo={geo} />
        )}
      </>
    );
  };
}
