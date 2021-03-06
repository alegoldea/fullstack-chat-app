import React, { useEffect } from "react";
import { Container, Box, Text, useColorModeValue } from "@chakra-ui/react";
import { TabList, Tab, Tabs, TabPanel, TabPanels } from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  let navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        gap="10px"
        bg={useColorModeValue("white", "gray.700")}
        w="100%"
        m="80px 0 15px 0"
        borderRadius="md"
        borderWidth="1px"
      >
        <Text
          fontSize={{ md: "25px" }}
          fontWeight="800"
          fontFamily="Work sans"
          _dark={{ color: "white" }}
          textShadow="2px 2px 8px purple"
        >
          Teletype
        </Text>
        <div class="fa-1x">
          <i style={{ position: "relative" }} class="fa-solid fa-envelope"></i>
        </div>
      </Box>
      <Box
        p={4}
        bg={useColorModeValue("white", "gray.700")}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList mb="1em">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
