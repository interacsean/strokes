import { Button, Flex, Select, Text } from "@chakra-ui/react";
// import x from 'react-icons';
import styled from "@emotion/styled";
import { withTargetValue } from "interfaceAdaptorsLayer/presenters/utils/withTargetValue";
import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { Stroke, StrokeWithDerivedFields } from "model/Stroke";
import { partial } from "ramda";
import { HoleViewProps } from "../Hole.View";

type StrokeViewProps = {
  strokeNum: number;
  stroke: StrokeWithDerivedFields;
  selectLie: HoleViewProps["selectStrokeLie"];
  selectClub: HoleViewProps["selectStrokeClub"];
  setPosition: (strokeNum: number) => void;
};

const UnsetButton = styled(Button)`
  border-color: orange;
  border-style: dashed;
`;

const liePairs = Object.entries(Lie);
const clubPairs = Object.entries(Club);

export function StrokeView(props: StrokeViewProps) {
  const selectCurStrokeLie = partial(props.selectLie, [props.strokeNum]) as (
    lieAsStr: string
  ) => void;
  const selectCurStrokeClub = partial(props.selectClub, [props.strokeNum]) as (
    clubAsStr: string
  ) => void;
  const setCurStrokePos = partial(props.setPosition, [props.strokeNum]);

  return (
    <Flex columnGap={2} justifyContent="flex-start" alignItems="baseline">
      <Text minW={4}>{props.strokeNum}</Text>
      {props.stroke.ballPos ? (
        <Button variant="ghost" onClick={setCurStrokePos}>
          📍
        </Button>
      ) : (
        <UnsetButton variant="primaryOutline" onClick={setCurStrokePos}>
          📍
        </UnsetButton>
      )}
      <Select
        onChange={withTargetValue(selectCurStrokeLie)}
        value={props.stroke.lie}
      >
        <option value="">-</option>
        {liePairs.map(([_lieKey, label]) => (
          <option
            key={_lieKey}
            value={label}
            selected={props.stroke.lie === label}
          >
            {label}
          </option>
        ))}
      </Select>
      <Select
        onChange={withTargetValue(selectCurStrokeClub)}
        value={props.stroke.club}
      >
        <option value="">-</option>
        {clubPairs.map(([_clubKey, label]) => (
          <option
            key={_clubKey}
            value={label}
            selected={props.stroke.club === label}
          >
            {label}
          </option>
        ))}
      </Select>
      <Text>
        {props.stroke.strokeDistance ? `${Math.round(props.stroke.strokeDistance)}m` : '–'}
      </Text>
    </Flex>
  );
}
