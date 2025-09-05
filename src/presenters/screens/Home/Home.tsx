import { Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RoutePaths } from "presenters/routes/RoutePaths";

type Props = {};

export function Home(props: Props) {
  return (
    <Flex flexDir="column">
      <Flex
        bgColor="primary.500"
        height="40vh"
        px={4}
        py={3}
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Text color="white" variant="heading">
          Strokes
        </Text>
      </Flex>
      <Flex flexDir="column" px={4} py={3}>
        <Button variant="link" as={Link} to={RoutePaths.ChooseCourse} py={3}>
          New Round
        </Button>
        <Button variant="link" as={Link} to={RoutePaths.PreviousRounds} py={3}>
          Previous Rounds
        </Button>
        <Button variant="link" as={Link} to={RoutePaths.Stats} py={3}>
          Stats
        </Button>
        <Button variant="link" as={Link} to={RoutePaths.Home} py={3}>
          Settings
        </Button>
      </Flex>
    </Flex>
  );
}
