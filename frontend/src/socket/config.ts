import { io } from "socket.io-client";

import { ACCESS_TOKEN } from "../constants/AccessToken";
import { BaseUrl } from "../constants/ApiContants";



export const socket = io(BaseUrl, {
  autoConnect: false,
  transports: ["polling", "websocket"],
  auth: {
    token: localStorage.getItem(ACCESS_TOKEN),
  },
  rejectUnauthorized: false
});

socket.on("connect_error", (err) => {
  console.error("❌ Socket connect error:", err.message);
});

socket.on("close", (reason) => {
  console.warn("⚠️ Socket closed:", reason);
});
