import { Box } from "@chakra-ui/react";
import React, { useContext } from "react";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatContext } from "../context/ChatProvider";

const Chatpage = () => {
  const { user } = useContext(ChatContext);

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default Chatpage;
