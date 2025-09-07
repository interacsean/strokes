import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Textarea,
  Text,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useState } from "react";

interface JsonPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jsonString: string) => void;
  title?: string;
  placeholder?: string;
}

export function JsonPasteModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Paste JSON",
  placeholder = "Paste your JSON data here...",
}: JsonPasteModalProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    setError(null);
    
    if (!jsonText.trim()) {
      setError("Please enter some JSON data");
      return;
    }

    try {
      JSON.parse(jsonText);
      onSubmit(jsonText);
      setJsonText("");
      onClose();
    } catch (err) {
      setError("Invalid JSON format");
    }
  };

  const handleClose = () => {
    setJsonText("");
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4} fontSize="sm" color="gray.600">
            Paste course JSON data to load it into the current session.
          </Text>
          
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {error}
            </Alert>
          )}
          
          <Textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder={placeholder}
            rows={10}
            fontFamily="mono"
            fontSize="sm"
          />
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit}>
            Load Course
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}