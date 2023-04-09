import { Flex, Box, Text } from "@chakra-ui/react"

type HoleOverviewProps = {
  holeNum: number,
  holeDistance: number | undefined,
  par: number,
  currentStrokeNum: number,
  distanceToHole: number | undefined,
  holeAltitudeDelta: number | undefined,
  playerRoundScore: number | undefined,
  windDirection?: number | undefined,
  windSpeed?: number | undefined,
  weather?: string | undefined,
}

function StrokesCount({ par, stroke }: { par: number, stroke: number }) {
  const strokes = Array(Math.max(par, stroke)).fill(0).map((_, i) => i + 1).slice(-6);
  return (
    <Flex>
      {strokes.map(
        (n) => (
          <Text
            display="inline-flex"
            justifyContent="center"
            alignItems="center"
            fontWeight="600"
            minWidth={n === stroke ? "1.4em" : "0.8em"}
            mx={n === stroke ? undefined : "0.3em"}
            height="1.4em"
            bgColor={n === stroke ? 'primary.900' : 'transparent'}
            color={n === stroke ? 'white' : 'black'}
            borderRadius="1.4em"
          >
            {n}
          </Text>
        )
      )}
    </Flex>
  );
}

export function HoleOverview(props: HoleOverviewProps) {
  const distUnit = "m"; // todo

  const roundScoreBg = props.playerRoundScore === undefined ? 'black'
    : props.playerRoundScore > 0 ? '#ff0000'
      : props.playerRoundScore < 0 ? 'black'
        : 'neutral.800';

  const forScoreOutcomeDescription = props.currentStrokeNum === props.par - 2 ? 'eagle'
    : props.currentStrokeNum === props.par - 1 ? 'birdie'
      : props.currentStrokeNum === props.par ? 'par'
        : props.currentStrokeNum === props.par + 1 ? 'bogey'
          : props.currentStrokeNum === props.par + 2 ? 'double bogey'
            : props.currentStrokeNum === props.par + 3 ? 'triple bogey'
              : undefined


  return (
    <Box borderBottom="1px solid" borderColor="neutral.500">
      <Flex justifyContent="stretch" bgColor="white">
        <Flex bgColor="primary.900" width="3rem" py={1} justifyContent="center" alignItems="center">
          <Text variant="heading" color="white">{props.holeNum}</Text>
        </Flex>
        <Flex py={1} px={2} flexDir="column" flexGrow={1}>
          <Text textTransform="uppercase">
            {props.holeDistance}{distUnit}
            <Text as="span" color="neutral.500" mx={1}>•</Text>
            Par {props.par}
          </Text>
          <Flex>
            <StrokesCount par={props.par} stroke={props.currentStrokeNum} />
            {forScoreOutcomeDescription && (
              <>
                <Text as="span" color="neutral.500" mx={1}>•</Text>
                <Text textTransform="uppercase">For {forScoreOutcomeDescription}</Text>
              </>
            )}
          </Flex>
        </Flex>
        {props.playerRoundScore !== undefined && (
          <Flex bgColor={roundScoreBg} justifyContent="center" alignItems="center" width="3rem">
            <Text variant="heading" color="white">
              {props.playerRoundScore > 0 ? '+'
                : props.playerRoundScore < 0 ? '-' : ''}
              {props.playerRoundScore === 0 ? 'E' : props.playerRoundScore}
            </Text>
          </Flex>
        )}
      </Flex>
      <Flex justifyContent="stretch" bgColor="neutral.100">
        <Box width="3rem" />
        <Flex py={1} px={2} flexGrow={1}>
          <Text textTransform="uppercase">{props.distanceToHole || '?'}{distUnit} to hole</Text>
        </Flex>
      </Flex>
    </Box>
  )
}
