import { Flex, Box, Text, Button } from "@chakra-ui/react";

export function StrokeCounter({
  par,
  activeStroke,
  totalStrokes,
  strokeClick,
}: {
  par: number | undefined;
  activeStroke: number;
  totalStrokes: number;
  strokeClick: (stroke: number) => void;
}) {
  const sz = 32; // size
  const numStrokesToShow = Math.max(par || 1, totalStrokes);
  const strokes = Array(isNaN(numStrokesToShow) ? par : numStrokesToShow)
    .fill(0)
    .map((_, i) => i + 1)
    .slice(-6);

  // todo: consider activeStroke, if user is scrolling back through
  return (
    <Flex alignItems="baseline">
      {strokes.map((n, i) => {
        const txt = (
          <Text
            display="inline-flex"
            justifyContent="center"
            alignItems="center"
            fontWeight="600"
            minWidth={`${sz}px`}
            height={`${sz}px`}
            bgColor={"transparent"}
            opacity={n > totalStrokes ? 0.4 : 1}
            color={!par || n <= par ? "white" : "pink"}
            borderBottom={n === activeStroke ? `3px solid` : `3px solid`}
            borderColor={n === activeStroke ? `white` : "transparent"}
            borderRight={n !== activeStroke ? "none" : undefined}
          >
            {strokes.length < numStrokesToShow && i === 0 ? "-" : n}
          </Text>
        );

        return n <= totalStrokes ? (
          // todo: Kill the 'active' style on buttons
          <Button
            key={n}
            variant="ghost"
            onClick={() => {
              n <= totalStrokes && strokeClick(n);
            }}
            p={0}
            minWidth={`${sz}px`}
            height={`${sz - 3}px`}
          >
            {txt}
          </Button>
        ) : (
          <Box key={n} minWidth={`${sz}px`} height={`${sz - 3}px`} p={0}>
            {txt}
          </Box>
        );
      })}
    </Flex>
  );
}
