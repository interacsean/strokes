import { Flex, Text } from "@chakra-ui/react";
import { Course } from "model/Course";
import { PosOptionMethods } from "model/PosOptions";
import React from "react";
import { selectCurrentTeeFromHole } from "state/course/selectors/currentTee";

type ScoreCardProps = {
  round: Course;
};

function getHoleScoreStyle(par: number, score: number) {
  if (score - par >= 2) {
    return {
      borderWidth: "7px",
      borderStyle: "double",
      borderColor: "#cc0000",
    };
  } else if (score - par === 1) {
    return {
      borderWidth: "2.5px",
      borderStyle: "solid",
      borderColor: "#cc0000",
    };
  } else if (score - par === -1) {
    return {
      borderWidth: "2.5px",
      borderStyle: "solid",
      borderColor: "#007700",
      borderRadius: "1em",
    };
  } else if (score - par <= -2) {
    return {
      borderWidth: "7px",
      borderStyle: "double",
      borderColor: "#007700",
      borderRadius: "1em",
    };
  }
  return {};
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ round }) => {
  let totalScore = 0;
  let totalPar = 0;
  let totalParComplete = 0;
  return (
    <Flex flexDir="column" rowGap={2} fontSize="1.2rem">
      <Flex borderBottom="1px solid" borderBottomColor="neutral.300">
        <Flex flex="4" justify="center" align="center">
          Hole
        </Flex>
        <Flex flex="4" justify="center" align="center">
          Par
        </Flex>
        <Flex flex="4" justify="center" align="center">
          Score
        </Flex>
        <Flex flex="1" justify="center" align="center">
          +/-
        </Flex>
      </Flex>
      {round.holes.map((hole, i) => {
        const teePlayed = selectCurrentTeeFromHole(hole);
        const par = teePlayed?.par || 4;
        const score = hole.strokes.length;
        const holeComplete = hole?.strokes.find(
          (s) => s.toPosSetMethod === PosOptionMethods.HOLE
        );
        if (holeComplete) {
          totalScore += score;
          totalParComplete += par;
        }
        totalPar += par;
        const holeScoreStyle = holeComplete
          ? getHoleScoreStyle(par, score)
          : {};
        const scoreReading = holeComplete
          ? score
          : score > 0
          ? `${score}*`
          : "-";

        return (
          <Flex key={i}>
            <Flex flex="4" justify="center" align="center">
              {hole.holeNum || i + 1}
            </Flex>
            <Flex flex="4" justify="center" align="center">
              {par}
            </Flex>
            <Flex flex="4" justify="center" align="center">
              <Text
                fontSize="1.2rem"
                style={holeScoreStyle}
                display="inline-block"
                width="2em"
                height="2em"
                lineHeight={
                  holeScoreStyle.borderStyle === "double" ? "1.2em" : "1.7em"
                }
                align="center"
                boxSizing="border-box"
              >
                {scoreReading}
              </Text>
            </Flex>
            <Flex flex="1" justify="center" align="center">
              {holeComplete
                ? `${totalScore - totalParComplete > 0 ? "+" : ""}${
                    totalScore - totalParComplete
                  }`
                : "-"}
            </Flex>
          </Flex>
        );
      })}
      <Flex borderTop="1px solid" borderTopColor="neutral.300">
        <Flex flex="4" />
        <Flex flex="4" justify="center" align="center">
          {totalPar}
        </Flex>
        <Flex flex="4" justify="center" align="center">
          {totalScore}
        </Flex>
        <Flex flex="1" justify="center" align="center">
          {totalScore - totalParComplete > 0 ? "+" : ""}
          {totalScore - totalParComplete}
        </Flex>
      </Flex>
      <Text variant="minor" color="neutral.800" mt={3}>
        <em>
          WIP: does not tally penalties, may not work great if a hole doesn't
          have a par preset for it
        </em>
      </Text>
    </Flex>
  );
};
