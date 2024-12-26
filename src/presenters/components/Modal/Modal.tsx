import { CloseIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { ReactNode } from "react";

type ModalProps = {
  children: ReactNode;
  closeButtonPos?: "tl" | "tr",
  onClose: () => void;
};

export function Modal({ children, onClose, closeButtonPos }: ModalProps) {
  const usedCloseButtonPos = closeButtonPos || "tr";
  return (
    <Flex flexDir={"column"} alignItems={"stretch"} columnGap={2} style={{ maxHeight: "100%", overflowY: "auto" }}>
      <IconButton
        aria-label="close"
        variant="ghost"
        position="absolute"
        top={1}
        left={usedCloseButtonPos === "tl" ? 1 : undefined}
        right={usedCloseButtonPos === "tr" ? 1 : undefined}
        zIndex={10}
        onClick={onClose}
      >
        <CloseIcon boxSize={4} />
      </IconButton>
      {children}
    </Flex>
  );
}
