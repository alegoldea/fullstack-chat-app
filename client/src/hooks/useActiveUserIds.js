import {
    useToast
} from "@chakra-ui/react";
import axios from 'axios';
import { useEffect, useState } from "react";

const FETCH_ACTIVE_STATUS_SECONDS = 2;

function useActiveUserIds(user) {
    const [activeUserIds, setActiveUserIds] = useState([]);
    const toast = useToast();

    useEffect(() => {
      const intervalId = setInterval(() => {
        (async () => {
          try {
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
  
            const { data } = await axios.get(
              "http://localhost:5000/api/chat/active-chat",
              config
            );
            setActiveUserIds(data);
          } catch (error) {
            toast({
              title: "Error Occured",
              description: "Failed to load active chats",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
            return;
          }
        })();
      }, FETCH_ACTIVE_STATUS_SECONDS * 1000);
      return () => {
        clearInterval(intervalId);
      };
      // eslint-disable-next-line
    }, []);

    return activeUserIds;
}

export { useActiveUserIds };
