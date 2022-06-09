import { Box } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import ChatBox from "../components/additions/ChatBox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/additions/SideDrawer";
import { ChatContext } from "../context/ChatProvider";

const Chatpage = () => {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="90vh" p="10px">
        {user && (
          <MyChats setFetchAgain={setFetchAgain} fetchAgain={fetchAgain} />
        )}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
