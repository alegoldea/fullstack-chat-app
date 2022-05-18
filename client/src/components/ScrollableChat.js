import { AspectRatio, Avatar, Box, Image, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatContext } from "../context/ChatProvider";
import "./styles.css";

const ScrollableChat = ({ messages }) => {
  const { user, selectedChat } = useContext(ChatContext);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          //if last message
          <div
            style={{
              display: "flex",
            }}
            key={m._id}
          >
            {isSameSender(messages, m, i, user._id) ||
            isLastMessage(messages, i, user._id) ? (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            ) : (
              <></>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "	#9370DB" : "#E6E6FA"
                }`,
                color: "black",
                borderRadius: "10px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                marginRight: isSameSenderMargin(messages, m, i, user._id)
                  ? 4
                  : 10,
              }}
            >
              {selectedChat.images.includes(m.content) ? (
                <Image
                  boxSize={{ lg: "300px", md: "200px", sm: "100px" }}
                  src={m.content}
                  alt="picture"
                />
              ) : (
                m.content
              )}
            </span>
            {/* <span> {m.createdAt} </span> */}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
