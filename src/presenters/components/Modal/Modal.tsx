import { CloseIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
};

export function Modal({ children, onClose }: ModalProps) {
  return (
    <Flex flexDir={"column"} alignItems={"stretch"} columnGap={2}>
      <IconButton
        aria-label="close"
        variant="ghost"
        position="absolute"
        top={1}
        left={1}
        zIndex={10}
        onClick={onClose}
      >
        <CloseIcon boxSize={4} />
      </IconButton>
      {children}
    </Flex>
  );
}
