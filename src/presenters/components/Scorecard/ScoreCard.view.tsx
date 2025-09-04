import { Checkbox, Flex, Text, Box } from "@chakra-ui/react";
import { Course } from "model/Course";
import { PosOptionMethods } from "model/PosOptions";
import { Strike } from "model/Strike";
import { StrokeType } from "model/StrokeType";
import { Club, shortClubNames } from "model/Club";
import React, { useState } from "react";
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

function getStrikeChar(strike: Strike | undefined): string {
  switch (strike) {
    case Strike.Clean:
      return "|";
    case Strike.Hook:
      return ")";
    case Strike.Slice:
      return "(";
    case Strike.Shank:
    case Strike.Push:
      return "/";
    case Strike.Pull:
      return "\\";
    case Strike.Thin:
      return "‾";
    case Strike.Fat:
      return "_";
    case Strike.Skyball:
      return "*";
    default:
      return " ";
  }
}

function getStrokeTypeColor(strokeType: StrokeType | undefined): string {
  switch (strokeType) {
    case StrokeType.FULL:
      return "rgba(144, 238, 144, 0.3)";
    case StrokeType.DRAW:
    case StrokeType.FADE:
    case StrokeType.HIGH:
    case StrokeType.HIGH_DRAW:
    case StrokeType.HIGH_FADE:
    case StrokeType.LOW:
    case StrokeType.LOW_DRAW:
    case StrokeType.LOW_FADE:
    case StrokeType.PUNCH:
      return "rgba(173, 216, 230, 0.3)";
    case StrokeType.THREE_QTR:
    case StrokeType.PITCH:
      return "rgba(192, 192, 192, 0.3)";
    case StrokeType.FLOP:
      return "rgba(255, 255, 224, 0.3)";
    case StrokeType.CHIP:
      return "rgba(221, 160, 221, 0.3)";
    case StrokeType.PUTT:
      return "rgba(144, 238, 144, 0.3)";
    default:
      return "transparent";
  }
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ round }) => {
  const [showStrokes, setShowStrokes] = useState(false);
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
        {showStrokes ? (
          <Flex flex="5" justify="center" align="center">
            Strokes
          </Flex>
        ) : (
          <>
            <Flex flex="4" justify="center" align="center">
              Score
            </Flex>
            <Flex flex="1" justify="center" align="center">
              +/-
            </Flex>
          </>
        )}
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
            {showStrokes ? (
              <Flex flex="5" justify="start" align="center">
                <Box fontFamily="monospace" fontSize="0.9rem">
                  {hole.strokes.map((stroke, idx) => {
                    const clubCode = Object.entries(Club).find(([, fullname]) => fullname === stroke.club)?.[0] as Club;
                    const clubText = stroke.club ? shortClubNames[clubCode] || clubCode : "";
                    const strikeText = getStrikeChar(stroke.strike);
                    const bgColor = getStrokeTypeColor(stroke.strokeType);
                    return (
                      <Text
                        key={idx}
                        as="span"
                        backgroundColor={bgColor}
                        px="2px"
                        mx="1px"
                        borderRadius="2px"
                      >
                        <span style={{ fontWeight: "bold" }}>{clubText}</span>{" "}
                        {strikeText}
                      </Text>
                    );
                  })}
                </Box>
              </Flex>
            ) : (
              <>
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
              </>
            )}
          </Flex>
        );
      })}
      <Flex borderTop="1px solid" borderTopColor="neutral.300">
        <Flex flex="4" />
        <Flex flex="4" justify="center" align="center">
          {totalPar}
        </Flex>
        {showStrokes ? (
          <Flex flex="5" />
        ) : (
          <>
            <Flex flex="4" justify="center" align="center">
              {totalScore}
            </Flex>
            <Flex flex="1" justify="center" align="center">
              {totalScore - totalParComplete > 0 ? "+" : ""}
              {totalScore - totalParComplete}
            </Flex>
          </>
        )}
      </Flex>
      <Checkbox 
        isChecked={showStrokes} 
        onChange={(e) => setShowStrokes(e.target.checked)}
        mt={2}
      >
        Show strokes
      </Checkbox>
      <Text variant="minor" color="neutral.800" mt={3}>
        <em>
          WIP: does not tally penalties, may not work great if a hole doesn't
          have a par preset for it
        </em>
      </Text>
    </Flex>
  );
};
