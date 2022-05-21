import {
  Avatar,
  Box,
  Button,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "../ChatLoading";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import GroupChatModal from "./GroupChatModal";
import { getDate } from "../../config/Functions";

const MyChats = ({ fetchAgain }) => {
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useContext(ChatContext);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      console.log(data);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAgain]);

  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg={useColorModeValue("white", "gray.700")}
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <VStack
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontWeight="900"> Chats </Text>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
            colorScheme="purple"
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </VStack>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg={useColorModeValue("white", "gray.700")}
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack className="customized-scrollbar" overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                px={3}
                py={2}
                bg={selectedChat === chat ? "#9370DB" : "gray.200"}
                _dark={{ bg: selectedChat === chat ? "#9370DB" : "gray.700" }}
                color={selectedChat === chat ? "white" : "black"}
                borderRadius="lg"
                key={chat._id}
                d="flex"
                flexDir="row"
              >
                <Box spacing="20px" mr="4" flexDir="column">
                  {!chat.isGroupChat ? (
                    <Avatar
                      rounded="full"
                      h="10"
                      w="10"
                      size="sm"
                      cursor="pointer"
                      name={getSenderFull(user, chat.users).name}
                      src={getSenderFull(user, chat.users).pic}
                    />
                  ) : (
                    <Avatar
                      rounded="full"
                      h="10"
                      w="10"
                      size="sm"
                      cursor="pointer"
                      name={chat.chatName}
                      src="https://cdn-icons-png.flaticon.com/512/166/166258.png"
                    />
                  )}
                </Box>
                <Box
                  d="flex"
                  flexDir="column"
                  pl="1"
                  _dark={{ color: "white" }}
                  boxSizing="border-box"
                  w="250px"
                  h="50px"
                  textOverflow="ellipsis"
                >
                  <Text
                    fontSize={{ base: "17px", md: "12px", lg: "md" }}
                    fontWeight="700"
                  >
                    {!chat.isGroupChat
                      ? getSender(user, chat.users)
                      : chat.chatName}
                  </Text>
                  <Box d="flex" flexDir="row" justifyContent="space-between">
                    <Text
                      isTruncated
                      fontSize={{ md: "xs", lg: "sm" }}
                      _dark={{ color: "gray.300" }}
                    >
                      {!chat.latestMessage ? (
                        <></>
                      ) : chat.latestMessage.sender._id === user._id ? (
                        `You: ${
                          selectedChat?.images?.includes(
                            chat.latestMessage.content
                          )
                            ? "sent an image"
                            : chat.latestMessage.content
                        }`
                      ) : (
                        `${chat.latestMessage.sender.name} : ${
                          selectedChat?.images?.includes(
                            chat.latestMessage.content
                          )
                            ? "sent an image"
                            : chat.latestMessage.content
                        }`
                      )}
                    </Text>
                    <Text
                      isTruncated
                      fontSize={{ md: "xs", lg: "sm" }}
                      _dark={{ color: "gray.300" }}
                    >
                      {!chat.latestMessage ? (
                        <></>
                      ) : (
                        getDate(chat?.latestMessage?.createdAt)
                      )}
                    </Text>
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
