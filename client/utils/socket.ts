import { io } from "socket.io-client";

const api_url = process.env.NEXT_PUBLIC_SOCKET_URL;
export const socket = io(api_url || "");
// export const socket = io("http://localhost:3001");
