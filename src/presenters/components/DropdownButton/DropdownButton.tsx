import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";

type DropdownButtonProps = {
  buttonText: string | undefined;
  buttonTextSmall: string | undefined;
  selectedValue: string | undefined;
  placeholder?: string;
  onClick: () => void;
  options: Array<{ label: string; value: string }>;
  onSelectChange: (value: string) => void;
};

export function DropdownButton(props: DropdownButtonProps) {
  return (
    <Flex flexDir="row" flex={1}>
      <Button
        flex={1}
        // variant={}
        borderRightRadius={0}
        onClick={props.onClick}
      >
        <Flex flexDir="column">
          <Text variant="button">{props.buttonText}</Text>
          {props.buttonTextSmall && (
            <Text variant="buttonSub">{props.buttonTextSmall}</Text>
          )}
        </Flex>
      </Button>
      <Flex
        position="relative"
        flexDir={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        border="1px solid"
        borderColor="neutral.500"
        borderLeft="none"
        borderRightRadius={5}
        px={2}
        minHeight="40px"
      >
        <select
          value={props.selectedValue}
          onChange={(e) => props.onSelectChange(e.target.value)}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        >
          <option disabled value="">
            {props.placeholder || "—"}
          </option>
          {props.options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              selected={option.value === props.selectedValue}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon />
      </Flex>
    </Flex>
  );
}
