import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ChatContext } from "../context/ChatProvider";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import "./styles.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import TypingAnimation from "./TypingAnimation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImage,
  faPaperPlane,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import Picker from "emoji-picker-react";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const toast = useToast();
  const inputFile = useRef(null);
  const submitMessage = useRef(null);
  const [picker, setPicker] = useState(false);
  const [chosenEmoji, setChosenEmoji] = useState(null);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
  };

  const addChatImage = async (imageURL) => {
    if (!imageURL) {
      console.log("Image URL not defined");
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "http://localhost:5000/api/chat/addimage",
        {
          chatId: selectedChat._id,
          imageURL: imageURL,
        },
        config
      );
      setSelectedChat(data);
      //setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (e) => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          `http://localhost:5000/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error occured",
          description: "Failed to send message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const handleImage = (pics) => {
    if (pics === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "fullstack-chatapp");
      data.append("cloud_name", "djeo89oo1");
      fetch("https://api.cloudinary.com/v1_1/djeo89oo1/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then(async function (data) {
          console.log(data.url.toString());
          await addChatImage(data.url.toString());
          setNewMessage(data.url.toString());
          setUploaded(!uploaded);
          // setFetchAgain(!fetchAgain);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast({
        title: "Not an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
  };

  const handleClick = () => {
    inputFile.current.click();
  };

  const handleKeyPress = (e) => {
    //it triggers by pressing the enter key
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );

      //console.log(messages);
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
    return () => {
      socket.off("message received");
    };
  });

  useEffect(() => {
    newMessage
      ? setNewMessage(newMessage + chosenEmoji?.emoji)
      : setNewMessage(chosenEmoji?.emoji);
  }, [chosenEmoji]);

  useEffect(() => {
    sendMessage().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploaded]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    //Typing logic
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)?.toUpperCase()}
                <ProfileModel user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName?.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            flexDir="column"
            p={3}
            bg="#E8E8E8"
            _dark={{ bg: "gray.800" }}
            w="100%"
            h="100%"
            borderRadius="lg"
            d="flex"
            justifyContent="flex-end"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="x1"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={handleKeyPress} isRequired mt={3}>
              {isTyping ? <TypingAnimation /> : <></>}
              <HStack d="flex" flexDir="row" justifyContent="space-between">
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  _dark={{ bg: "gray.700", color: "white" }}
                  placeholder="Enter a message"
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Input
                  type="file"
                  p={1.5}
                  accept="image/*"
                  ref={inputFile}
                  style={{ display: "none" }}
                  onChange={(e) => handleImage(e.target.files[0])}
                />
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
                    <Picker onEmojiClick={onEmojiClick} />
                  </div>
                )}
                <Button
                  colorScheme="purple"
                  rounded="lg"
                  width="20"
                  onClick={handleClick}
                >
                  <FontAwesomeIcon icon={faFileImage} />
                </Button>
                <Button
                  colorScheme="purple"
                  rounded="lg"
                  width="20"
                  ref={submitMessage}
                  onClick={sendMessage}
                  type="submit"
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </Button>
              </HStack>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
