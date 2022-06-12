import io from "socket.io-client";

const ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const socket = io(ENDPOINT);

export default socket;
