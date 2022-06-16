# Teletype

Teletype is a fullstack chat app that provides end-to-end encryption for one-to-one conversations.

## Stack

Client: React JS

Server: Node JS, Express JS

Database: Mongo DB

Real-time communication is implemented using socket.io library.

Encryption is based on methods from the TweetNaCl and simple-crypto-js libraries.

## Run locally

Clone the project

```git clone https://github.com/piyush-eon/mern-chat-app```

Go to the project directory

```cd mern-chat-app```

Install dependencies

```
cd server/
npm install
cd client/
npm install
```
   
Start the server

```
cd server/ 
npm start
```

Start the Client

```
/*open new terminal*/
cd client
npm start
```
## Features

![2- logare](https://user-images.githubusercontent.com/62378466/174053153-0dd3be98-a3af-4aff-9023-3d41a0ec7ad5.png)

![11 - cautare utilizatori](https://user-images.githubusercontent.com/62378466/174053209-86ef5fb9-d8d4-4e51-aede-1de7f866e716.png)

![5 - photos and emojis](https://user-images.githubusercontent.com/62378466/174053248-064dfb6a-af14-432b-9e05-d77a2b201765.png)

- provides end-to-end encryption for one-to-one conversations 

Each user has a public-private key pair and uses asymmetric encryption to encrypt a symmetric key unique for each conversation. This hybrid cryptosystem makes the process more efficient and secure than using only one type of encryption.
Asymmetric encryiption is based on EC Diffie Hellman algorithm, whereas symmetric encryption is done using AES-256.

- sign up form 
- real-time messaging 
- image sending 
- dark mode
- group chatting 
- CRUD group update form 
- non-persistent notifications regarding new messages
- typing indicator

# Limitations 

Given the principles of end-to-end encryption and the limitations of developing a web application, the login feature is only working for the device and browser that the account was created in.
At this moment, there is no mechanism for accessing messages from other devices, as the private key of the user is stored in the local storage of the browser. 
This key should be a secret and should not be distributed. 
Also, the end-to-end encryption only solves the aspect of storing the messages in an encrypted format. 
Aspect such as forward secrecy are yet to be considered. 
Future development of this project should improve the encryption feature. 


