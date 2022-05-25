import { Box } from "@chakra-ui/react";
import React, { useContext, useState, useEffect } from "react";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatContext } from "../context/ChatProvider";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
const Chatpage = () => {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    let socket = io(ENDPOINT);

    const intervalId = setInterval(() => {
      if (user) {
        console.log(user?._id);
        socket.emit("periodic ping", user?._id);
      }
    }, 3000);
    return () => {
      clearInterval(intervalId);
      socket.off("periodic ping");
    };
  }, [user]);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
