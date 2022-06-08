import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { decodeKeyPair } from "../util/asymmetric";

export const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [selectedChat, setSelectedChat] = useState();
  const [chats, setChats] = useState([]);
  const [notification, setNotification] = useState([]);
  const navigate = useNavigate();
  const [keyForEncryptionAndDecryption, setKeyForEncryptionAndDecryption] =
    useState(null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo === null) {
      navigate("/");
      return;
    }
    // console.log(userInfo);

    const keyPair = decodeKeyPair({
      encodedPrivateKey: userInfo.encodedPrivateKey,
      encodedPublicKey: userInfo.encodedPublicKey,
    });

    setUser({ ...userInfo, keyPair });
  }, [navigate]);

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        keyForEncryptionAndDecryption,
        setKeyForEncryptionAndDecryption,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
