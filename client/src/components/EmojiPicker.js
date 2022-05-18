import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { Button } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import "./styles.css";

const EmojiPicker = () => {
  const [picker, setPicker] = useState(false);
  return (
    <>
      <Button
        colorScheme="purple"
        rounded="lg"
        width="20"
        onClick={() => setPicker(!picker)}
      >
        <FontAwesomeIcon icon={faFaceSmile} />
      </Button>
      {picker && (
        <div className="custom-dialog">
          <Picker />
        </div>
      )}
    </>
  );
};

export default EmojiPicker;
