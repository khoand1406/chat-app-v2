import { io } from "socket.io-client";
import { BaseUrl } from "../constants/ApiContants";

export const socket= io(`${BaseUrl}`, {
    autoConnect: false
})