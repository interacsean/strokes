import { Flex, Select } from "@chakra-ui/react";
import { withTargetValue } from "interfaceAdaptorsLayer/presenters/utils/withTargetValue";
import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { partial } from "ramda";
import { HoleViewProps } from "../Hole.View";

type StrokeViewProps = {
  strokeNum: number,
  stroke: Stroke,
  selectLie: HoleViewProps['selectStrokeLie'],
  selectClub: HoleViewProps['selectStrokeClub'],
};

const liePairs = Object.entries(Lie);
const clubPairs = Object.entries(Club);

export function StrokeView(props: StrokeViewProps) {
  const selectCurStrokeLie = partial(props.selectLie, [props.strokeNum]) as (lieAsStr: string) => void;
  const selectCurStrokeClub = partial(props.selectClub, [props.strokeNum]) as (clubAsStr: string) => void;

  return (
    <Flex columnGap={2} justifyContent="flex-start" alignItems="baseline">
      <p>{props.strokeNum}</p>
      <Select onChange={withTargetValue(selectCurStrokeLie)} value={props.stroke.lie}>
        {liePairs.map(([_lieKey, label]) => (
          <option key={_lieKey} value={label} selected={props.stroke.lie === label}>
            {label}
          </option>
        ))}
      </Select>
      <Select onChange={withTargetValue(selectCurStrokeClub)} value={props.stroke.club}>
        <option value="">-</option>

        {clubPairs.map(([_clubKey, label]) => (
          <option key={_clubKey} value={label} selected={props.stroke.club === label}>
            {label}
          </option>
        ))}
      </Select>
      
    </Flex>
  )
}
