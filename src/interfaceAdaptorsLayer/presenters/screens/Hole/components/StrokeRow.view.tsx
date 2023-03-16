import { Flex, Select } from "@chakra-ui/react";
import { withTargetValue } from "interfaceAdaptorsLayer/presenters/utils/withTargetValue";
import { Lie } from "model/Lie";
import { Stroke } from "model/Stroke";
import { partial } from "ramda";
import { HoleViewProps } from "../Hole.View";

type StrokeViewProps = {
  strokeNum: number,
  stroke: Stroke,
  selectStrokeLie: HoleViewProps['selectStrokeLie']
};

const liePairs = Object.entries(Lie);

export function StrokeView(props: StrokeViewProps) {
  const selectCurStrokeLie = partial(props.selectStrokeLie, [props.strokeNum]) as (lieAsStr: string) => void;

  return (
    <Flex columnGap={2} justifyContent="flex-start" alignItems="baseline">
      <p>{props.strokeNum}</p>
      <Select onChange={withTargetValue(selectCurStrokeLie)} value={props.stroke.lie}>
        {liePairs.map(([_lieKey, label]) => (
          <option value={label} selected={props.stroke.lie === label}>{label}</option>
        ))}
      </Select>

    </Flex>
  )
}
