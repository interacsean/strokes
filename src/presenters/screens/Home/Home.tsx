import { Link } from "@chakra-ui/react";
import { RoutePaths } from "presenters/routes/RoutePaths";

type Props = {};

export function Home(props: Props) {
  return <Link href={RoutePaths.ChooseCourse}>New round</Link>;
}
