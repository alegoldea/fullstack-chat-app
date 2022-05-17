import { Avatar, Tooltip, useColorMode } from "@chakra-ui/react";
import React, { useContext, useEffect, useRef } from "react";
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
  const { user } = useContext(ChatContext);

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
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                marginRight: isSameSenderMargin(messages, m, i, user._id)
                  ? 20
                  : 10,
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
