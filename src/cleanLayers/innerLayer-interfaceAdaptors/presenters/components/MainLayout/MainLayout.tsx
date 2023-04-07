import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <Flex flexDir={"column"} alignItems={"stretch"}>
      <Outlet />
    </Flex>
  );
}
