import { Box, useColorModeValue } from "@chakra-ui/react";
import React, { useContext } from "react";
import { ChatContext } from "../../context/ChatProvider";
import SingleChat from "../SingleChat";

const ChatBox = ({ fetchContent, setFetchContent }) => {
  const { selectedChat } = useContext(ChatContext);

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg={useColorModeValue("white", "gray.700")}
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat
        fetchContent={fetchContent}
        setFetchContent={setFetchContent}
      />
    </Box>
  );
};

export default ChatBox;
