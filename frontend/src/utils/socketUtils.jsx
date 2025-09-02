import { io } from "socket.io-client";

export const socket = io("http://localhost:1414", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
});

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};