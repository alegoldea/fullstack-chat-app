import React from "react";
import axios from "axios";
import { useEffect } from "react";

const Chatpage = () => {
  const fetchChats = async () => {
    const data = await axios.get("/api/chat");
    console.log(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);
  return <div>Chats</div>;
};

export default Chatpage;
