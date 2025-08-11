import type React from "react";
import type { MessageInputProps } from "../models/props/ChatWindowProps";
import { useState, type FormEvent } from "react";
import { sendMessages } from "../services/messageServices";



const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {

  const [content, setContent]= useState("");
  const userId= localStorage.getItem("userId");

  
  
  const handleMessageSubmit= async (e: FormEvent)=> {
    e.preventDefault();
    const payload= {
      conversationId: conversationId,
      senderId: userId,
      content: content,
      sendAt: new Date(),
    }
    try {
      const response= await sendMessages(payload)
      if(!response) return false;
      setContent("");

    } catch (error) {
      console.log(error)
    }


  }
  return (
    <div className="flex p-4 bg-white">
      <form>
    <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none"
        value={content}
        onChange={(e)=> setContent(e.target.value)}
        
      />
      <button onClick={handleMessageSubmit} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">
        Send
      </button>
      </form>
      
    </div>
  );
};

export default MessageInput;