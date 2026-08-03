import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Course } from "model/Course";
import { ScoreCard } from "presenters/components/Scorecard/ScoreCard.view";
import { copyToClipboard } from "usecases/device/copyToClipboard";

// Android's clipboard tops out around 20KB
const MAX_CLIPBOARD_LENGTH = 20000;

type ScorecardPanelProps = {
  course: Course;
  onClose: () => void;
};

export function ScorecardPanel(props: ScorecardPanelProps) {
  const exportRound = () => {
    const json = JSON.stringify(props.course);
    if (json.length > MAX_CLIPBOARD_LENGTH) {
      // For large data, offer to download as file
      if (
        window.confirm(
          `The data is large (${json.length} characters). Android has a ~20KB clipboard limit. Download as file instead?`
        )
      ) {
        import("usecases/device/downloadAsFile").then(
          ({ downloadCourseAsJSON }) => {
            downloadCourseAsJSON(props.course, props.course.courseName);
          }
        );
      } else {
        copyToClipboard(json, true);
      }
    } else {
      copyToClipboard(json);
    }
  };

  return (
    <Flex
      position="fixed"
      top={0}
      right={0}
      bottom={0}
      left={0}
      zIndex={40}
      flexDir="column"
      alignItems="stretch"
      bgColor="white"
    >
      <Flex
        alignItems="center"
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="neutral.500"
        py={1}
      >
        <Button
          aria-label="Back to round"
          variant="ghost"
          onClick={props.onClose}
          px={4}
        >
          <ArrowBackIcon boxSize={6} />
        </Button>
        <Text variant="area-heading">Scorecard</Text>
        <Box width="3.5rem" />
      </Flex>
      <Box flex={1} overflowY="auto" px={4} py={3}>
        <Flex flexDir="column" rowGap={3}>
          <ScoreCard round={props.course} />
          <Text variant="area-heading">Export</Text>
          <Text>
            Export the JSON data of your current course + round, for external
            use and analysis.
          </Text>
          <Box>
            <Button onClick={exportRound}>Export round</Button>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
}
