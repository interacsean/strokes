import { ChevronDownIcon } from "@chakra-ui/icons";
import { Flex, Text } from "@chakra-ui/react";

type CustomModalSelectProps = {
  selectedText: undefined | string;
  selectedValue: undefined | string;
  placeholder: string;
  onOpen: () => void;
};

export function CustomModalSelect(props: CustomModalSelectProps) {
  return (
    <Flex
      flexDir={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
      onClick={props.onOpen}
      border="1px solid"
      borderColor="neutral.500"
      px={2}
      minHeight="44px"
      width="100%"
    >
      {props.selectedText ? (
        <Text>{props.selectedText}</Text>
      ) : (
        <Text color="placeholder.100">{props.placeholder}</Text>
      )}
      <ChevronDownIcon />
    </Flex>
  );
}
