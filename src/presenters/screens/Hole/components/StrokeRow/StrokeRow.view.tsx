import { Box, Button, Flex, Select, Text } from "@chakra-ui/react";
// import x from 'react-icons';
import { withTargetValue } from "presenters/utils/withTargetValue";
import { Club } from "model/Club";
import { Lie } from "model/Lie";
import { StrokeWithDerivedFields } from "model/Stroke";
import { partial } from "ramda";
import { HoleViewProps } from "../../Hole.view";
import {
  clubWidth,
  Container,
  lieWidth,
  strokeNumWidth,
  strokeTypeWidth,
} from "./StrokeRow.styles";
import { StrokeType } from "model/StrokeType";

type StrokeViewProps = {
  strokeNum: number;
  stroke: StrokeWithDerivedFields;
  selectFromLie: HoleViewProps["selectStrokeFromLie"];
  selectToLie: HoleViewProps["selectStrokeToLie"];
  selectClub: HoleViewProps["selectStrokeClub"];
  selectStrokeType: HoleViewProps["selectStrokeType"];
  setStrokePosition: (strokeNum: number) => void;
  setLiePosition: (strokeNum: number) => void;
  current: boolean;
};

const liePairs = Object.entries(Lie);
const clubPairs = Object.entries(Club);
const typePairs = Object.entries(StrokeType);

export function StrokeView(props: StrokeViewProps) {
  const selectCurStrokeLie = partial(props.selectFromLie, [
    props.strokeNum,
  ]) as (lieAsStr: string) => void;
  const selectCurStrokeClub = partial(props.selectClub, [props.strokeNum]) as (
    clubAsStr: string
  ) => void;
  const selectCurStrokeType = partial(props.selectStrokeType, [
    props.strokeNum,
  ]) as (strokeTypeAsStr: string) => void;
  const setCurStrokePos = partial(props.setStrokePosition, [props.strokeNum]);
  const setCurLiePos = partial(props.setLiePosition, [props.strokeNum]);

  return (
    <Container>
      <Text textAlign="right" paddingRight="0.25em" flexBasis={strokeNumWidth}>
        {props.strokeNum}
      </Text>
      <Flex flexGrow={1} flexDir="column" rowGap={2}>
        <Flex columnGap={2} justifyContent="flex-start" alignItems="baseline">
          <Box flexBasis={lieWidth}>
            <Select
              onChange={withTargetValue(selectCurStrokeLie)}
              value={props.stroke.fromLie || ""}
            >
              <option value="">-</option>
              {liePairs.map(([_lieKey, label]) => (
                <option key={_lieKey} value={label}>
                  {label}
                </option>
              ))}
            </Select>
          </Box>
          <Box flexBasis={clubWidth}>
            <Select
              onChange={withTargetValue(selectCurStrokeClub)}
              value={props.stroke.club || ""}
            >
              <option value="">-</option>
              {clubPairs.map(([_clubKey, label]) => (
                <option key={_clubKey} value={label}>
                  {label}
                </option>
              ))}
            </Select>
          </Box>
          <Box flexBasis={strokeTypeWidth}>
            <Select
              onChange={withTargetValue(selectCurStrokeType)}
              value={props.stroke.strokeType || ""}
            >
              <option value="">-</option>
              {typePairs.map(([_typeKey, label]) => (
                <option key={_typeKey} value={label}>
                  {label}
                </option>
              ))}
            </Select>
          </Box>
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
                variant={props.stroke.fromPos ? "outline" : "primary"}
                onClick={setCurLiePos}
              >
                🏌️‍♂️
              </Button>
            </Box>
            <Box>
              <Button
                variant={props.stroke.toPos ? "outline" : "primary"}
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
