import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const onSubmit = async (info) => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user/login`,
        info,
        config
      );
      toast({
        title: "Login succesful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="email_login" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
          border="none"
          borderBottom="2px solid #805AD5"
          placeholder="Enter your e-mail"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
        />
      </FormControl>
      {errors.email ? (
        <Text color="red" role="alert">
          {errors.email.message}
        </Text>
      ) : null}
      <FormControl id="password_login" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            border="none"
            borderBottom="2px solid #805AD5"
            type={show ? "text" : "password"}
            placeholder="Enter your password"
            {...register("password", {
              required: true,
            })}
          />
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              variant="solid"
              colorScheme="purple"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {errors.password ? (
        <Text color="red" role="alert">
          {errors.password.message}
        </Text>
      ) : null}
      <Button
        variant="solid"
        backgroundColor="#9370DB"
        width="100%"
        style={{ marginTop: 15 }}
        type="submit"
        isLoading={loading}
      >
        Login
      </Button>
    </form>
  );
};

export default Login;
