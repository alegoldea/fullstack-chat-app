import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const Chatpage = () => {
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const { data } = await axios.get("http://localhost:5000/api/chat");
    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
      Chat Page
    </div>
  );
};

export default Chatpage;
