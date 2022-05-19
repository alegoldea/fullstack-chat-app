import { Box } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import React from "react";

const UserBadgeItem = ({ handleFunction, content }) => {
  return (
    <div>
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        background="purple"
        color="white"
        cursor="pointer"
        onClick={handleFunction}
      >
        {content}
        <CloseIcon pl={1} />
      </Box>
    </div>
  );
};

export default UserBadgeItem;
