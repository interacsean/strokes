import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { SingleStrokeView, SingleStrokeViewProps } from "./SingleStroke.view";
import { Club } from "model/Club";
import { PosOption, PosOptionMethods, PosOptions } from "model/PosOptions";
import { Lie, TeeLies } from "model/Lie";
import { calculateCaddySuggestions } from "usecases/stroke/calculateCaddySuggestions";
import { calculateDistanceBetweenPositions } from "usecases/hole/calculateDistanceBetweenPositions";
import { LatLng } from "model/LatLng";
import { StrokeType } from "model/StrokeType";

type GeneratedPropKeys =
  | "clubs"
  | "fromPosOptions"
  | "toPosOptions"
  | "prevStroke"
  | "nextStroke"
  | "fromLies"
  | "toLies"
  | "caddySuggestions"
  | "distToTarget"
  | "pinPlayedPos"
  | "teePlayedPos" 
  | "distSinceFromPos" 
  | "onFromPosClick"
  | "mapClickAction"
  | "onToPosClick"
  | "onMapClick"
  | "acceptCaddySuggestion";

type SingleStrokePublicProps = Omit<SingleStrokeViewProps, GeneratedPropKeys>;

const toLies = [
  Lie.FAIRWAY,
  Lie.WRONG_FAIRWAY,
  Lie.LIGHT_ROUGH,
  Lie.DEEP_ROUGH,
  Lie.BUNKER,
  Lie.GREEN,
  Lie.FRINGE,
  Lie.WATER,
  Lie.HAZARD,
];

export function withSingleStrokeDependencies(
  HoleView: FC<SingleStrokeViewProps>
) {
  return function Hole(props: SingleStrokePublicProps) {
    // todo: get possible clubs from Bag state

    const {
      hole: { tees, pins, pinPlayed, teePlayed, holeNum },
      strokes,
      strokeNum,
      stroke: { fromPos, fromLie, fromPosSetMethod, toPosSetMethod },
      clubStats,
      setFromPosition,
      setFromPosMethod,
      setToPosition,
      setToPosMethod,
      selectStrokeType,
      selectClub,
      currentPosition,
    } = props;

    const [localStrokeNum, setLocalStrokeNum] = useState(strokeNum);
    useEffect(
      function updateLocalStrokeNumOnStrokeNumChange() {
        setLocalStrokeNum(strokeNum);
      },
      [strokeNum]
    );
    const [localHoleNum, setLocalHoleNum] = useState(holeNum);
    useEffect(
      function updateLocalHoleNumOnHoleNumChange() {
        setLocalHoleNum(holeNum);
      },
      [holeNum]
    );
    const [mapClickAction, setMapClickAction] = useState<null | "from" | "to">(
      null
    );

    // todo: consider moving into selector
    const pinPlayedPos = useMemo(
      () => (pinPlayed ? pins[pinPlayed] : Object.values(pins)[0]),
      [pins, pinPlayed]
    );

    const teePlayedPos = useMemo(
      () => (teePlayed ? tees[teePlayed] : Object.values(tees)[0]),
      [tees, teePlayed]
    );

    useEffect(
      function takeActionOnFromMethodChange() {
        if (holeNum === localHoleNum && strokeNum === localStrokeNum) {
          // fromPosSetMethod and not because of changing shots or holes
          switch (fromPosSetMethod) {
            case PosOptionMethods.TEE:
              // todo: determine the correct fromTee
              if (teePlayedPos?.pos) {
                setFromPosition(strokeNum, teePlayedPos?.pos);
              }
              break;
            case PosOptionMethods.CUSTOM:
              setMapClickAction("from");
              break;
            case PosOptionMethods.DROP:
              // todo: show drop stuff?
              break;
            case PosOptionMethods.LAST_SHOT:
              setFromPosition(strokeNum, prevStroke?.toPos);
              break;
          }
        }
      },
      [fromPosSetMethod]
    );

    useEffect(
      function takeActionOnToMethodChange() {
        if (holeNum === localHoleNum && strokeNum === localStrokeNum) {
          // toPosSetMethod and not because of changing shots or holes
          switch (toPosSetMethod) {
            case PosOptionMethods.CUSTOM:
              setMapClickAction("to");
              break;
            case PosOptionMethods.HOLE:
              setToPosition(strokeNum, pinPlayedPos);
              break;
            case PosOptionMethods.NEAR_PIN:
              setToPosition(strokeNum, pinPlayedPos);
              // todo:
              // 2) queing up change as this call overwrites the previous update since it is paired with the current course
              // if (!toLie) selectToLie(strokeNum, Lie.GREEN);
              break;
          }
        }
      },
      [toPosSetMethod],
    );

    const prevStroke = useMemo(() => {
      if (strokeNum < 2) return undefined;
      return strokes[strokeNum - 2];
    }, [strokeNum, strokes]);

    const nextStroke = useMemo(() => {
      return strokes[strokeNum];
    }, [strokeNum, strokes]);

    const fromPosOptions = useMemo(() => {
      const fo: PosOption[] = [];
      if (strokeNum === 1) {
        const teeNames = Object.keys(tees);
        if (teeNames.length === 1) {
          fo.push({
            buttonText: `Tee`,
            label: `Tee`,
            value: `${PosOptionMethods.TEE}/${teeNames[0]}`,
          });
        } else {
          teeNames.map((tee) =>
            fo.push({
              buttonText: `Tee (${tee.slice(0, 3)})`,
              label: `Tee (${tee})`,
              value: `${PosOptionMethods.TEE}/${tee}`,
            })
          );
        }
      }
      if (strokeNum > 1) {
        fo.push(PosOptions[PosOptionMethods.LAST_SHOT]);
      }
      fo.push(PosOptions[PosOptionMethods.GPS]);
      // todo: exclude if last stroke's toLie was hazard/water
      if (strokeNum > 1) {
        fo.push(PosOptions[PosOptionMethods.DROP]);
      }
      fo.push(PosOptions[PosOptionMethods.CUSTOM]);
      return fo;
    }, [tees, strokeNum]);

    const onFromPosClick = useCallback(() => {
      switch (fromPosSetMethod) {
        case PosOptionMethods.LAST_SHOT:
          setFromPosition(strokeNum);
          if (strokeNum >= 2 && prevStroke && currentPosition) {
            setPendingPos(["to", currentPosition, strokeNum - 1]);
          }
          break;
        case PosOptionMethods.GPS:
        case PosOptionMethods.DROP:
          setFromPosition(strokeNum);
          break;
        case PosOptionMethods.CUSTOM:
          setMapClickAction("from");
          break;
        case PosOptionMethods.TEE:
        // skip
      }
    }, [strokeNum, fromPosSetMethod, setFromPosition, prevStroke, currentPosition]);
  

    // todo: decide if buttonText is worked out here or in xPosButtonText
    const toPosOptions = useMemo(() => {
      const to = [PosOptions[PosOptionMethods.GPS]];
      to.push(PosOptions[PosOptionMethods.CUSTOM]);
      if (pinPlayedPos) {
        to.push(PosOptions[PosOptionMethods.NEAR_PIN]);
        to.push(PosOptions[PosOptionMethods.HOLE]);
      }
      return to;
    }, [pinPlayedPos]);

    const fromLies = useMemo(() => {
      if (strokeNum === 1) {
        return TeeLies;
      } else {
        return Object.values(Lie).filter((lie) => {
          if (lie === Lie.WATER) return false;
          // todo: only allow tees if previous shot was OOB
          return true;
        });
      }
    }, [strokeNum]);

    const caddySuggestions = useMemo(() => {
      return fromPos && pinPlayedPos && clubStats
        ? calculateCaddySuggestions(
            clubStats,
            fromLie as Lie,
            fromPos,
            pinPlayedPos
          )
        : [];
    }, [fromPos, fromLie, pinPlayedPos, clubStats]);

    const distToTarget =
      fromPos && pinPlayedPos
        ? calculateDistanceBetweenPositions(fromPos, pinPlayedPos)
        : null;

    const distSinceFromPos = useMemo(() => {
      if (!fromPos || !currentPosition) {
        return null;
      }
      return Math.round(
        calculateDistanceBetweenPositions(fromPos, currentPosition)
      );
    }, [fromPos, currentPosition]);
      
    const onMapClick = useCallback(
      (pos: LatLng) => {
        if (mapClickAction === "from") {
          setFromPosition(strokeNum, pos);
          setPendingPosMethod(["from", PosOptionMethods.GPS]);
        } else if (mapClickAction === "to") {
          setToPosition(strokeNum, pos);
          setPendingPosMethod(["to", PosOptionMethods.GPS]);
        }
        setMapClickAction(null);
      },
      [mapClickAction, strokeNum, setToPosition, setFromPosition]
    );

    // Work-around for not being able to update two attributes at once
    const [pendingPosMethod, setPendingPosMethod] = useState<
      ["from" | "to", PosOptionMethods] | null
    >(null);
    useEffect(
      function updatePosMethodFromQueue() {
        if (pendingPosMethod?.[0] === "from") {
          setFromPosMethod(strokeNum, pendingPosMethod[1]);
          setPendingPosMethod(null);
        } else if (pendingPosMethod?.[0] === "to") {
          setToPosMethod(strokeNum, pendingPosMethod[1]);
          setPendingPosMethod(null);
        }
      },
      [pendingPosMethod?.[0], pendingPosMethod?.[1]],
    );
  
    const [pendingStrokeType, setPendingStrokeType] = useState<StrokeType | null>(
      null
    );
    useEffect(
      function updateStrokeTypeFromQueue() {
        if (pendingStrokeType) {
          selectStrokeType(strokeNum, pendingStrokeType);
          setPendingStrokeType(null);
        }
      },
      [pendingStrokeType, strokeNum]
    );
  
    const [pendingPos, setPendingPos] = useState<
      ["from" | "to", LatLng, number | undefined] | null
    >(null);
    useEffect(
      function updatePosFromQueue() {
        if (pendingPos?.[0] === "from") {
          setFromPosition(pendingPos?.[2] || strokeNum, pendingPos[1]);
          setPendingPos(null);
        } else if (pendingPos?.[0] === "to") {
          setToPosition(pendingPos?.[2] || strokeNum, pendingPos[1]);
          setPendingPos(null);
        }
      },
      [pendingPos?.[0], pendingPos?.[1], pendingPos?.[2]]
    );
    
    const onToPosClick = useCallback(() => {
      switch (toPosSetMethod) {
        case PosOptionMethods.GPS:
          setToPosition(strokeNum);
          break;
        case PosOptionMethods.CUSTOM:
          setMapClickAction("to");
          break;
      }
      if (nextStroke && nextStroke.fromPosSetMethod === PosOptionMethods.LAST_SHOT && currentPosition) {
        setPendingPos(["from", currentPosition, strokeNum + 1])
      }
    }, [toPosSetMethod, setToPosition, strokeNum, nextStroke, currentPosition, setPendingPos]);

    const acceptCaddySuggestion = useCallback(() => {
      if (caddySuggestions?.[0]?.club) {
        selectClub(strokeNum, caddySuggestions[0].club);
        if (caddySuggestions?.[0]?.strokeType) {
          setPendingStrokeType(caddySuggestions?.[0]?.strokeType);
        }
      }
    }, [strokeNum, selectClub, caddySuggestions, setPendingStrokeType]);


    const viewProps: SingleStrokeViewProps = {
      ...props,
      fromPosOptions,
      toPosOptions,
      prevStroke,
      nextStroke,
      fromLies,
      toLies,
      caddySuggestions,
      distToTarget,
      distSinceFromPos,
      onFromPosClick,
      mapClickAction,
      pinPlayedPos,
      teePlayedPos,
      onToPosClick,
      onMapClick: mapClickAction ? onMapClick : undefined,
      acceptCaddySuggestion,
      clubs: [
        Club.D,
        Club["3W"],
        Club["4H"],
        Club["4I"],
        Club["5I"],
        Club["6I"],
        Club["7I"],
        Club["8I"],
        Club["9I"],
        Club.PW,
        Club.SW,
        Club.P,
      ],
    };

    return (
      <>
        <SingleStrokeView {...viewProps} />
      </>
    );
  };
}
