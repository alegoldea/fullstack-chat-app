import React from "react";
import { Image, useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from "@chakra-ui/react";

const ImageComponent = ({ src }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const grabbingCursor = { cursor: "grabbing" };

  return (
    <div style={grabbingCursor}>
      <Image
        src={src}
        onClick={onOpen}
        alt="Image"
        objectFit="contain"
        maxH="300px"
        maxW="400px"
      />
      {
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <Image
                objectFit="contain"
                maxW="800px"
                maxH="1000px"
                src={src}
                onClick={onClose}
                alt="no image"
              />
            </ModalContent>
          </Modal>
        </>
      }
    </div>
  );
};

export default ImageComponent;
