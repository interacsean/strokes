import { FC, useMemo } from "react";
import { SingleStrokeView, SingleStrokeViewProps } from "./SingleStroke.view";
import { Club } from "model/Club";
import { PosOptionMethods, PosOptions } from "model/PosOptions";
import { Lie, TeeLies } from "model/Lie";
import { calculateCaddySuggestions } from "usecases/stroke/calculateCaddySuggestions";

type GeneratedPropKeys =
  | "clubs"
  | "fromPosOptions"
  | "toPosOptions"
  | "prevStroke"
  | "fromLies"
  | "toLies"
  | "caddySuggestions";
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
      hole: { tees, pins, pinPlayed },
      strokes,
      strokeNum,
      stroke: { fromPos, fromLie },
      clubStats,
    } = props;
    // todo: consider moving into selector
    const pinPlayedUsed = useMemo(
      () => (pinPlayed ? pins[pinPlayed] : Object.values(pins)[0]),
      [pins, pinPlayed]
    );

    const prevStroke = useMemo(() => {
      if (strokeNum < 2) return undefined;
      return strokes[strokeNum - 2];
    }, [strokeNum, strokes]);

    const fromPosOptions = useMemo(() => {
      const fo = [PosOptions[PosOptionMethods.GPS]];
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
      // todo: exclude if last stroke's toLie was hazard/water
      if (strokeNum > 1) {
        fo.push(PosOptions[PosOptionMethods.LAST_SHOT]);
      }
      fo.push(PosOptions[PosOptionMethods.CUSTOM]);
      fo.push(PosOptions[PosOptionMethods.DROP]);
      return fo;
    }, [tees, strokeNum]);

    // todo: decide if buttonText is worked out here or in xPosButtonText
    const toPosOptions = useMemo(() => {
      const to = [PosOptions[PosOptionMethods.GPS]];
      to.push(PosOptions[PosOptionMethods.CUSTOM]);
      if (pinPlayedUsed) {
        to.push(PosOptions[PosOptionMethods.NEAR_PIN]);
        to.push(PosOptions[PosOptionMethods.HOLE]);
      }
      return to;
    }, [pinPlayedUsed]);

    const fromLies = useMemo(() => {
      if (strokeNum === 1) {
        return TeeLies;
      } else {
        return Object.values(Lie).filter(
          (lie) => !TeeLies.includes(lie) && lie !== Lie.WATER
        );
      }
    }, [strokeNum]);

    const caddySuggestions = useMemo(() => {
      return fromPos && pinPlayedUsed && clubStats
        ? calculateCaddySuggestions(
            clubStats,
            fromLie as Lie,
            fromPos,
            pinPlayedUsed
          )
        : [];
    }, [fromPos, fromLie, pinPlayedUsed, clubStats]);

    const viewProps: SingleStrokeViewProps = {
      ...props,
      fromPosOptions,
      toPosOptions,
      prevStroke,
      fromLies,
      toLies,
      caddySuggestions,
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
