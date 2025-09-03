import cors from 'cors';
import express from 'express';
import fs from "fs";
import { createServer } from 'https';
import path from "path";
import { Server } from 'socket.io';
import { sequelize } from "./database/config";
import authRoutes from './routes/auth.route';
import conversationRoutes from './routes/conversation.route';
import eventRoutes from './routes/events.route';
import messageRoutes from './routes/messages.route';
import notificationRoutes from './routes/notification.route';
import userRoutes from './routes/users.route';
import { verifyJWT } from './utils/jwt';


const app= express();
const PORT= process.env.PORT;
app.use(express.json());
app.use(cors());

app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventRoutes);

const options = {
  key: fs.readFileSync(path.join(__dirname, "../localhost+2-key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "../localhost+2.pem")),
};
const httpServer= createServer(options, app);
const io = new Server(httpServer, {
  cors: {
    origin: "https://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
    if (!token) return next(new Error("No token"));
    const payload = verifyJWT(token);
    if (!payload || !payload.id) return next(new Error("Invalid token payload"));
    socket.data.user = payload;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    next(new Error("JWT error"));
  }
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id, "User: ", socket.data.user);

    socket.on("join", () => {
    const userId = socket.data.user.id;
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
  });

  socket.on("close", () => {
    console.log("Client closed:", socket.id);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

(async () => {
  try {
    await sequelize.sync();
    console.log("Sequelize connected to SQL Server");
  } catch (error) {
    console.error("Sequelize connection error:", error);
  }
})();

httpServer.listen(PORT, ()=> {
    console.log(`Server is listening at: https://localhost:${PORT}`);
})