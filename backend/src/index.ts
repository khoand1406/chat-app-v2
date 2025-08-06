import express from 'express';
import { sequelize } from "./database/config";
import authRoutes from './routes/auth.route';
import conversationRoutes from './routes/conversation.route';
import messageRoutes from './routes/messages.route';
import userRoutes from './routes/users.route';


const app= express();
const PORT= 3000;
app.use(express.json());

app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

(async () => {
  try {
    
    await sequelize.sync();
    
    console.log("Sequelize connected to SQL Server");
  } catch (error) {
    console.error("Sequelize connection error:", error);
  }
})();

app.listen(PORT, ()=> {
    console.log(`Server is listening at: http://localhost:${PORT}`);
})