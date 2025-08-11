import express from 'express';
import { sequelize } from "./database/config";
import authRoutes from './routes/auth.route';
import conversationRoutes from './routes/conversation.route';
import messageRoutes from './routes/messages.route';
import userRoutes from './routes/users.route';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app= express();
const PORT= process.env.PORT;
app.use(express.json());
app.use(cors());

app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const httpServer= createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});

app.set("io", io);
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined room user_${userId}`);
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
    console.log(`Server is listening at: http://localhost:${PORT}`);
})