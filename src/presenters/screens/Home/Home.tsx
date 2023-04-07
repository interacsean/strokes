import { Flex, Link } from "@chakra-ui/react";
import { RoutePaths } from "presenters/routes/RoutePaths";

type Props = {};

export function Home(props: Props) {
  return <Link href={RoutePaths.Hole}>New (jump to hole)</Link>;
}
