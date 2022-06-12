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
import {
  faFaceSmile,
  faFileImage,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import Picker from "emoji-picker-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import SimpleCrypto from "simple-crypto-js";
import { getOtherName, getOtherObject } from "../config/chatLogics";
import socket from "../config/socketClient";
import { ChatContext } from "../context/ChatProvider";
import {
  decodePublicKey,
  decode_message_in_transit,
  decrypt,
} from "../util/asymmetric";
import ProfileModal from "./additions/ProfileModal";
import UpdateGroupChatModal from "./additions/UpdateGroupChatModal";
import ScrollableWindow from "./ScrollableWindow";
import "../styles.css";
import TypingAnimation from "./additions/TypingAnimation";
let selectedChatCompare;

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

  const {
    user,
    selectedChat,
    setSelectedChat,
    notification,
    setNotification,
    keyForEncryptionAndDecryption,
    setKeyForEncryptionAndDecryption,
  } = useContext(ChatContext);

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
        `${process.env.REACT_APP_BACKEND_URL}/api/chat/addimage`,
        {
          chatId: selectedChat._id,
          imageURL: imageURL,
        },
        config
      );
      setSelectedChat(data);
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

        let messageToBeSent = newMessage;

        if (!selectedChat.isGroupChat) {
          messageToBeSent = keyForEncryptionAndDecryption.encrypt(newMessage);
          console.log("Original message:", newMessage);
          console.log("Encrypted message:", messageToBeSent);
          console.log(
            "Decrypted message:",
            keyForEncryptionAndDecryption.decrypt(messageToBeSent)
          );
        }

        const { data } = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/message`,
          {
            content: messageToBeSent,
            chatId: selectedChat._id,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
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
          //console.log(data.url.toString());
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
        `${process.env.REACT_APP_BACKEND_URL}/api/message/${selectedChat._id}`,
        config
      );
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
    fetchMessages();
    selectedChatCompare = selectedChat;
    if (!selectedChat) return;
    if (selectedChat?.isGroupChat) return;
    if (localStorage.getItem(`chatkey_${selectedChat?._id}`) !== null) {
      const decryptedChatKey = localStorage.getItem(
        `chatkey_${selectedChat?._id}`
      );
      const cryptoKey = new SimpleCrypto(decryptedChatKey);
      setKeyForEncryptionAndDecryption(cryptoKey);
      return;
    }

    const theirEncodedPublicKey = getOtherObject(
      user,
      selectedChat?.users
    )?.encodedPublicKey;

    const theirPublicKey = decodePublicKey(theirEncodedPublicKey);

    const keyToDecrypt = JSON.parse(selectedChat?.chatKey);

    const decodedMessageInTransit = decode_message_in_transit(keyToDecrypt);

    const decryptedChatKey = decrypt(
      decodedMessageInTransit,
      user.keyPair.secretKey,
      theirPublicKey
    );

    localStorage.setItem(`chatkey_${selectedChat?._id}`, decryptedChatKey);

    const cryptoKey = new SimpleCrypto(decryptedChatKey);

    setKeyForEncryptionAndDecryption(cryptoKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  useEffect(() => {
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      socket.off("setup");
      socket.off("connected");
      socket.off("typing");
      socket.off("stop typing");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Loads the key from localStorage when selecting a chat

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (
          // TODO: check this for groups
          // !notification.includes(newMessageReceived)
          !notification.some(
            (n) => n.sender.name === newMessageReceived.sender.name
          )
        ) {
          setNotification([newMessageReceived, ...notification]);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
      setFetchAgain(!fetchAgain);
    });

    return () => {
      socket.off("message received");
    };
  });

  useEffect(() => {
    newMessage
      ? setNewMessage(newMessage + chosenEmoji?.emoji)
      : setNewMessage(chosenEmoji?.emoji);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    let timerLength = 3000;
    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;
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
          <Text className="chat-header" fontSize="lg">
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getOtherName(user, selectedChat.users)?.toUpperCase()}
                <ProfileModal user={getOtherObject(user, selectedChat.users)} />
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
          <Box className="box" bg="#E8E8E8" _dark={{ bg: "gray.800" }}>
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
                <ScrollableWindow
                  scrollableMessages={messages}
                  chatKey={keyForEncryptionAndDecryption}
                  isGroupChat={selectedChat?.isGroupChat || false}
                />
              </div>
            )}
            <FormControl onKeyDown={handleKeyPress} isRequired mt={3}>
              {isTyping ? <TypingAnimation /> : <></>}
              <HStack d="flex" flexDir="row" justifyContent="space-between">
                <Input
                  letiant="filled"
                  bg="#E0E0E0"
                  _dark={{ bg: "gray.700", color: "white" }}
                  placeholder="Type a message..."
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
                  className="buttons"
                  colorScheme="purple"
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
                  className="buttons"
                  colorScheme="purple"
                  onClick={handleClick}
                >
                  <FontAwesomeIcon icon={faFileImage} />
                </Button>
                <Button
                  colorScheme="purple"
                  className="buttons"
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
