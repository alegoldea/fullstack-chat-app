import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./additions/ChatLoading";
import { getOtherName, getOtherObject } from "../config/chatLogics";
import GroupChatModal from "./additions/GroupChatModal";
import { getDate } from "../config/dateConfig";

const FETCH_ACTIVE_STATUS_SECONDS = 2;

const ConvoList = ({ fetchAgain }) => {
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, chats, setChats } =
    useContext(ChatContext);
  const [activeUserIds, setActiveUserIds] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      (async () => {
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          const { data } = await axios.get(
            "http://localhost:5000/api/chat/active-chat",
            config
          );
          setActiveUserIds(data);
        } catch (error) {
          toast({
            title: "Error Occured",
            description: "Failed to load active chats",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          return;
        }
      })();
    }, FETCH_ACTIVE_STATUS_SECONDS * 1000);
    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const getTextToDisplayUnderAvatar = (chat) => {
    if (!chat.latestMessage) return <></>;
    if (chat.latestMessage.sender._id === user._id) {
      return `You sent a message`;
    } else {
      return `${chat.latestMessage.sender.name} sent a message`;
    }
  };

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
            {chats.map((chat) => {
              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  px={3}
                  py={2}
                  w="100%"
                  bg={selectedChat?._id === chat._id ? "#9370DB" : "white"}
                  _dark={{
                    bg: selectedChat?._id === chat._id ? "#9370DB" : "gray.700",
                  }}
                  color={selectedChat?._id === chat._id ? "white" : "black"}
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
                        name={getOtherObject(user, chat.users).name}
                        src={getOtherObject(user, chat.users).pic}
                      >
                        <AvatarBadge
                          boxSize="1.25em"
                          bg={
                            activeUserIds.includes(
                              getOtherObject(user, chat.users)._id
                            )
                              ? "green.500"
                              : "gray"
                          }
                        />
                      </Avatar>
                    ) : (
                      <Avatar
                        rounded="full"
                        h="10"
                        w="10"
                        size="sm"
                        cursor="pointer"
                        name={chat.chatName}
                        src="https://cdn-icons-png.flaticon.com/512/166/166258.png"
                      >
                        <AvatarBadge
                          boxSize="1.25em"
                          bg={
                            activeUserIds.some(
                              (r) =>
                                chat.users.map((c) => c._id).includes(r) &&
                                r !== user._id
                            )
                              ? "green.500"
                              : "gray"
                          }
                        />
                      </Avatar>
                    )}
                  </Box>
                  <Box
                    d="flex"
                    flexDir="column"
                    pl="1"
                    boxSizing="border-box"
                    w="100%"
                    textOverflow="ellipsis"
                  >
                    <Text
                      fontSize={{ base: "17px", md: "12px", lg: "md" }}
                      fontWeight="700"
                      _dark={{ color: "white" }}
                    >
                      {!chat.isGroupChat
                        ? getOtherName(user, chat.users)
                        : chat.chatName}
                    </Text>
                    <Box d="flex" flexDir="row" justifyContent="space-between">
                      <Text
                        isTruncated
                        fontSize={{ md: "xs", lg: "sm" }}
                        _dark={{ color: "gray.300" }}
                      >
                        {getTextToDisplayUnderAvatar(chat)}
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
              );
            })}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default ConvoList;
