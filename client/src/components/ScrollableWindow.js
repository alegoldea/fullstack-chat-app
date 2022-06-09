import { Avatar, Tooltip } from "@chakra-ui/react";
import React, { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/chatLogic.js";
import { ChatContext } from "../context/ChatProvider";
import ImageComponent from "./additions/ImageComponent";
import "../styles.css";

const ScrollableWindow = ({ messages }) => {
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
            <div
              _dark={{ color: "white" }}
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "	#9370DB" : "RGBA(0, 0, 0, 0.16)"
                }`,
                borderRadius: "10px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                marginRight: isSameSenderMargin(messages, m, i, user._id)
                  ? 5
                  : 10,
              }}
            >
              {m.content.startsWith(
                "http://res.cloudinary.com/djeo89oo1/image/upload"
              ) ? (
                <>
                  {``}
                  <ImageComponent src={m.content} />
                </>
              ) : (
                m.content
              )}
            </div>
            {/* <span> {m.createdAt} </span> */}
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableWindow;