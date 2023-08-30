import { io } from "socket.io-client";
const URL = process.env.NEXT_PUBLIC_API;

// @ts-ignore
const socket = io(URL, { autoConnect: false });

export default socket;
