import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Flex, Text } from "@chakra-ui/react";
import { CSSProperties } from "react";

type DropdownButtonProps = {
  buttonStyle?: CSSProperties;
  buttonText: string | undefined;
  buttonTextSmall: string | undefined;
  buttonColor?: string | undefined;
  buttonTextColor?: string | undefined;
  selectedValue: string | undefined;
  placeholder?: string;
  onClick: () => void;
  options: Array<{ label: string; value: string }>;
  onSelectChange: (value: string) => void;
};

export function DropdownButton(props: DropdownButtonProps) {
  const textColor = {
    buttonPrimary: "buttonPrimaryText",
    buttonUnsatisfied: "buttonUnsatisfiedText",
    buttonReadOnly: "buttonReadOnlyText",
  }[props.buttonColor || "buttonPrimary"];
  const borderColor = {
    buttonPrimary: undefined,
    buttonUnsatisfied: "buttonUnsatisfiedBorder",
    buttonReadOnly: "buttonReadOnlyBorder",
  }[props.buttonColor || "buttonPrimary"];

  const disabled = props.buttonColor === "buttonReadOnly";

  return (
    <Flex flexDir="row" flex={1}>
      <Button
        flex={1}
        px={1}
        borderRightRadius={0}
        onClick={props.onClick}
        bgColor={props.buttonColor}
        color={textColor}
        border={borderColor ? "1px solid" : undefined}
        borderColor={borderColor}
        disabled={disabled}
        borderRight="none"
        style={props.buttonStyle}
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
          {props.options.map((option) => {
            // todo: support multiple tees
            const selected = !props.selectedValue
              ? false
              : option.value.startsWith(props.selectedValue);
            return (
              <option
                key={option.value}
                value={option.value}
                selected={selected}
              >
                {option.label}
              </option>
            );
          })}
        </select>
        <ChevronDownIcon />
      </Flex>
    </Flex>
  );
}
