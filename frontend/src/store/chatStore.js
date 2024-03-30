// chatStore.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chat data from your API
        const response = await axios.get('http://localhost:3000/api/chat');
        const chatData = response.data.chats;
        console.log(chatData);

        // Set fetched chat data to state
        setChats(chatData);
      } catch (error) {
        console.error('Error fetching chat data:', error);
      }
    };

    fetchData();
  }, []); // Run this effect only once on component mount

  const sendMessage = async (newMessage) => {
    console.log(newMessage.text)
    // console.log(selectedChat)
    try { 
      // Prepare message payload
      const payload = {
        traineeID: selectedChat.name,
        trainerID: 'trainer113', // Assuming trainerID is constant
        connection: false, // Assuming this value is constant
        message: newMessage.text,
        sender: 'trainer', // Assuming sender is always the trainee
      };
  
      console.log('Sending message:', payload); // Log the payload
  
      // Send message to your API
      const response = await axios.post('http://localhost:3000/api/chat', payload);

      console.log(response)
      
      // If message sent successfully, update chat in state
      const updatedChat = {
        ...selectedChat,
        messages: [...selectedChat.messages, newMessage],
      };
  
      setSelectedChat(updatedChat);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  

  const receiveMessage = async (chatId, message) => {
    try {
      // Receive message logic here (if applicable)
    } catch (error) {
      console.error('Error receiving message:', error);
    }
  };

  return (
    <ChatContext.Provider value={{ chats, setChats, selectedChat, setSelectedChat, sendMessage, receiveMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
