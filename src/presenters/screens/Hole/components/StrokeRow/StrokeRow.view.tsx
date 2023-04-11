import { Box, Button, Flex, Select, Text } from "@chakra-ui/react";
// import x from 'react-icons';
import { withTargetValue } from "presenters/utils/withTargetValue";
import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { StrokeWithDerivedFields } from "model/Stroke";
import { partial } from "ramda";
import { HoleViewProps } from "../../Hole.View";
import { Container } from "./StrokeRow.styles";

type StrokeViewProps = {
  strokeNum: number;
  stroke: StrokeWithDerivedFields;
  selectLie: HoleViewProps["selectStrokeLie"];
  selectClub: HoleViewProps["selectStrokeClub"];
  setStrokePosition: (strokeNum: number) => void;
  setLiePosition: (strokeNum: number) => void;
  current: boolean;
};

const liePairs = Object.entries(Lie);
const clubPairs = Object.entries(Club);

export function StrokeView(props: StrokeViewProps) {
  const selectCurStrokeLie = partial(props.selectLie, [props.strokeNum]) as (
    lieAsStr: string
  ) => void;
  const selectCurStrokeClub = partial(props.selectClub, [props.strokeNum]) as (
    clubAsStr: string
  ) => void;
  const setCurStrokePos = partial(props.setStrokePosition, [props.strokeNum]);
  const setCurLiePos = partial(props.setLiePosition, [props.strokeNum]);

  return (
    <Container>
      <Text minW={4}>{props.strokeNum}</Text>
      <Flex flexDir="column" rowGap={2}>
        <Flex columnGap={2} justifyContent="flex-start" alignItems="baseline">
          {/* {props.stroke.strokePos ? (
            <Button variant="ghost" onClick={setCurStrokePos}>
              📍
            </Button>
          ) : (
            <UnsetButton variant="primaryOutline" onClick={setCurStrokePos}>
              📍
            </UnsetButton>
          )} */}
          <Select
            onChange={withTargetValue(selectCurStrokeLie)}
            value={props.stroke.lie}
          >
            <option value="">-</option>
            {liePairs.map(([_lieKey, label]) => (
              <option key={_lieKey} value={label}>
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
              <option key={_clubKey} value={label}>
                {label}
              </option>
            ))}
          </Select>
          <Text>
            {props.stroke.strokeDistance
              ? `${Math.round(props.stroke.strokeDistance)}m`
              : props.stroke.distanceToHole
              ? `(${Math.round(props.stroke.distanceToHole)}m)`
              : "–"}
          </Text>
        </Flex>
        {props.current && (
          <Flex columnGap={2} justifyContent="flex-start" alignItems="baseline">
            <Box>
              <Button
                variant={props.stroke.liePos ? "outline" : "primary"}
                onClick={setCurLiePos}
              >
                🏌️‍♂️
              </Button>
            </Box>
            <Box>
              <Button
                variant={props.stroke.strokePos ? "outline" : "primary"}
                onClick={setCurStrokePos}
              >
                ⚪️
              </Button>
            </Box>
          </Flex>
        )}
      </Flex>
    </Container>
  );
}
