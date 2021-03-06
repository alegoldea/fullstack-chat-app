import React from "react";
import { Button } from "@chakra-ui/button";
import { Input, InputRightElement, InputGroup } from "@chakra-ui/input";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Text } from "@chakra-ui/react";

const Signup = () => {
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const handleClick = () => setShow(!show);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "fullstack-chatapp");
      data.append("cloud_name", "djeo89oo1");
      fetch("https://api.cloudinary.com/v1_1/djeo89oo1/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          //console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "Not an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const onSubmit = async (info) => {
    setLoading(true);
    if (info.password !== info.confirmpass) {
      toast({
        title: "Passwords not matching",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Get the body with the pic field
      const bodyWithPic = { ...info, pic: pic };
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/user`,
        bodyWithPic,
        config
      );
      toast({
        title: "Registration succesful",
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

  const validatePassword = (value) => {
    if (value.length < 6) {
      return "Password should be at-least 6 characters.";
    } else if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#.$*])/.test(value)
    ) {
      return "Password should contain at least one uppercase letter, lowercase letter, digit, and special symbol.";
    }
    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your name"
          {...register("name", {
            required: true,
            minLength: {
              value: 3,
              message: "Name too short",
            },
            maxLength: {
              value: 15,
              message: "Name too long",
            },
          })}
        />
      </FormControl>
      {errors.name ? (
        <Text color="red" role="alert">
          {errors.name.message}
        </Text>
      ) : null}
      <FormControl id="email" isRequired>
        <FormLabel>E-mail</FormLabel>
        <Input
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
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: true,
              validate: validatePassword,
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
      <FormControl id="confirm_password" isRequired>
        <FormLabel>Confirm password</FormLabel>
        <InputGroup>
          <Input
            type="password"
            placeholder="Confirm password"
            {...register("confirmpass", {
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
      <FormControl id="pic">
        <FormLabel>Upload pic</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        variant="solid"
        backgroundColor="#9370DB"
        width="100%"
        style={{ marginTop: 15 }}
        type="submit"
        isLoading={loading}
      >
        Register
      </Button>
    </form>
  );
};

export default Signup;
