import { head, last, partial } from "ramda";
import { nextHole } from "usecases/course/nextHole";
import { prevHole } from "usecases/course/prevHole";
import { saveHole } from "usecases/course/saveHole";
import { FC, useCallback, useMemo, useState } from "react";
import { useCourseState } from "state/course/courseState";
import { HoleViewProps } from "./Hole.view";
import { Hole, Hole as HoleModel } from "model/Hole";
import { setHolePar } from "usecases/hole/setHolePar";
import { mergePartStroke } from "usecases/stroke/mergePartStroke";
import { saveStroke } from "usecases/course/saveStroke";
import { Lie } from "model/Lie";
import { setStrokeFromLie } from "usecases/stroke/setStrokeFromLie";
import { setStrokeToLie } from "usecases/stroke/setStrokeToLie";
import { Stroke, StrokeWithDerivedFields } from "model/Stroke";
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
import { selectCurrentPinFromHole } from "state/course/selectors/currentPin";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";
import { DeepPartial } from "types/DeepPartial";
import { PosOptionMethods } from "model/PosOptions";

type HolePublicProps = {};

const USE_FAKE_POSITION = true;

function shouldShowNewStroke(strokes: Stroke[]) {
  return strokes.length === 0;
}

export function withHoleDependencies(HoleView: FC<HoleViewProps>) {
  return function Hole(_props: HolePublicProps) {
    const { state: courseState, updateState: updateCourseState } =
      useCourseState();

    // todo: validate this does something and couldn't just be selectCurrentHole(courseState)
    const currentHole = useSelector(selectCurrentHole, courseState);
    const currentPin = useSelector(selectCurrentPinFromHole, currentHole);
    const currentTee = useSelector(selectCurrentTeeFromHole, currentHole);
    const { strokes } = currentHole;

    const saveStrokeAndUpdate = useCallback(
      (strokeNum: number, partStroke: Partial<Stroke>) => {
        const currentStroke =
          strokes[strokeNum - 1] || newStrokeFromStrokes(strokes, currentHole);
        const updatedStroke = mergePartStroke(currentStroke, partStroke);
        saveStroke(updateCourseState, currentHole, strokeNum, updatedStroke);
      },
      [updateCourseState, currentHole, strokes]
    );

    const addStroke = useCallback(() => {
      const strokeToAdd = {
        ...newStrokeFromStrokes(strokes, currentHole),
        fromPos: last(strokes)?.toPos,
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
      (partHole: DeepPartial<HoleModel>) =>
        saveCurrentHole(mergePartHole(currentHole, partHole) as Hole),
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
        // todo: handle taking tee name
        holeUpdateAndSave({ pins: { pin: holePos } });
      },
      [holeUpdateAndSave]
    );

    const setFromPosMethod = useCallback(
      (strokeNum: number, posMethod: PosOptionMethods) => {
        saveStrokeAndUpdate(strokeNum, { fromPosSetMethod: posMethod });
      },
      [saveStrokeAndUpdate]
    );

    const setToPosMethod = useCallback(
      (strokeNum: number, posMethod: PosOptionMethods) => {
        saveStrokeAndUpdate(strokeNum, { toPosSetMethod: posMethod });
      },
      [saveStrokeAndUpdate]
    );

    const setTeePos = useCallback(
      (teeName: string, teePos: LatLng) => {
        holeUpdateAndSave({
          tees: {
            ...(currentHole.tees || {}),
            [teeName]: {
              ...currentHole.tees[teeName],
              pos: teePos,
            },
          },
        } as DeepPartial<HoleModel>);
      },
      [holeUpdateAndSave, currentHole]
    );

    const setStrokeFromLieAndUpdate = useCallback(
      (strokeNum: number, lie: Lie | string) => {
        const saveStrokeNumAndUpdate = partial(saveStrokeAndUpdate, [
          strokeNum,
        ]);
        setStrokeFromLie(
          saveStrokeNumAndUpdate,
          strokeNum,
          strokes[strokeNum - 1],
          lie
        );
      },
      [saveStrokeAndUpdate, strokes]
    );

    const setStrokeToLieAndUpdate = useCallback(
      (strokeNum: number, lie: Lie) => {
        const saveStrokeNumAndUpdate = partial(saveStrokeAndUpdate, [
          strokeNum,
        ]);
        setStrokeToLie(
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

    const setToPosition = useCallback(
      (strokeNum: number, pos: LatLng) => {
        saveStrokeAndUpdate(strokeNum, { toPos: pos });
      },
      [saveStrokeAndUpdate]
    );

    const setFromPosition = useCallback(
      (strokeNum: number, pos: LatLng) => {
        console.log({ setFromPos: true, strokeNum, pos });
        saveStrokeAndUpdate(strokeNum, { fromPos: pos });
      },
      [saveStrokeAndUpdate]
    );

    const preprocessedStrokes: StrokeWithDerivedFields[] = useMemo(() => {
      if (shouldShowNewStroke(currentHole.strokes)) {
        const newStroke = newStrokeFromStrokes(
          currentHole.strokes,
          currentHole
        );
        return calculateStrokeDistances(currentHole, [
          ...currentHole.strokes,
          newStroke,
        ]) as StrokeWithDerivedFields[];
      }
      return calculateStrokeDistances(
        currentHole,
        currentHole.strokes
      ) as StrokeWithDerivedFields[];
    }, [currentHole]);
    console.log(preprocessedStrokes.map(({ fromPos, toPos, strokeDistance }) => ({ fromPos, toPos, strokeDistance })));

    // todo: retry-on loop until high accuracy – how oftern to ping
    const geo = useGeolocated({
      positionOptions: { enableHighAccuracy: true },
      watchPosition: true,
    });

    const [fakePos, setFakePos] = useState<LatLng>({
      lat: -37.758007544374024,
      lng: 144.98399686860003,
      alt: 45,
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
      const lastStroke = last(preprocessedStrokes);
      return lastStroke
        ? calculateCaddySuggestions(currentHole, lastStroke)
        : [];
    }, [currentHole, preprocessedStrokes]);

    const distanceToHole = useMemo(
      () =>
        currentPosition && currentPin
          ? calculateDistanceBetweenPositions(currentPosition, currentPin)
          : undefined,
      [currentPin, currentPosition]
    );

    const holeAltitudeDelta = useMemo(
      () =>
        currentPosition && currentPosition.alt !== null && currentPin
          ? currentPin?.lat - currentPosition?.alt
          : undefined,
      [currentPin, currentPosition]
    );

    const holeLength = useMemo(() => {
      const chosenTeePos = head(preprocessedStrokes)?.fromPos;
      return chosenTeePos && currentPin
        ? calculateDistanceBetweenPositions(chosenTeePos, currentPin)
        : undefined;
    }, [currentPin, preprocessedStrokes]);

    const roundScore = useMemo(
      () =>
        courseState.holes.reduce((scoreAcc, hole) => {
          if (hole.strokes.length && hole.completed) {
            return scoreAcc + hole.strokes.length - (currentTee?.par || 0);
          }
          return scoreAcc;
        }, 0),
      [currentTee, courseState.holes]
    );

    const viewProps: HoleViewProps = {
      nextHole: nextHoleAndUpdate,
      prevHole: prevHoleAndUpdate,
      hole: currentHole,
      holeNum: courseState.currentHoleNum,
      setPar: setParAndUpdate,
      selectStrokeFromLie: setStrokeFromLieAndUpdate,
      selectStrokeToLie: setStrokeToLieAndUpdate,
      selectStrokeClub: setStrokeClubAndUpdate,
      selectStrokeType: setStrokeTypeAndUpdate,
      setFromPosMethod,
      setToPosMethod,
      preprocessedStrokes,
      setToPosition,
      setFromPosition,
      currentPosition,
      caddySuggestions,
      setHolePos,
      setTeePos,
      addStroke,
      distanceToHole,
      holeAltitudeDelta,
      holeLength,
      roundScore,
      par: currentTee?.par,
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
