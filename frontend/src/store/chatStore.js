// chatStore.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const trainerinfo = Cookies.get('trainerinfo')
  const traineeinfo = Cookies.get('traineeinfo')
  //console.log(traineeinfo)
  var loginType, payload

  if (traineeinfo === undefined){
    //console.log("trainer account login")
    loginType = "trainer"
  }else if (trainerinfo=== undefined){
    //console.log("trainee account login")
    loginType = "trainee"
  }
  //console.log(traineeinfo.role)
  //console.log(traineeinfo.traineeid)
  useEffect(() => {
    
    fetchData();
  }, []); // Run this effect only once on component mount


  const fetchData = async () => {
    try {
        // Fetch chat data from your API
        const response = await axios.get('http://localhost:3000/api/chat');
        const chatData = response.data.chats;
        console.log(chatData);

        // Set fetched chat data to state
        setChats(chatData);
    }
       catch (error) {
      console.error('Error fetching chat data:', error);

    }
  };

  const sendMessage = async (newMessage) => {
    console.log(newMessage.text)
    // console.log(selectedChat)
    try { 
      // Prepare message payload
      if (loginType === "trainer"){
        payload = {
          traineeID: selectedChat.name,
          trainerID: 'trainer7', // Assuming trainerID is constant
          connection: false, // Assuming this value is constant
          message: newMessage.text,
          sender: 'trainer', // Assuming sender is always the trainee
        };
      } else {
        payload = {
          traineeID: 'trainee7',
          trainerID: selectedChat.name, // Assuming trainerID is constant
          connection: false, // Assuming this value is constant
          message: newMessage.text,
          sender: 'trainee', // Assuming sender is always the trainee
        };
      }
      
      console.log('Sending message:', payload); // Log the payload
  
      // Send message to your API
      const response = await axios.post('http://localhost:3000/api/chat', payload);

      console.log(response)
      console.log(chats)
      
      // If message sent successfully, update chat in state
      const updatedChat = {
      };
  
      setSelectedChat(updatedChat);
      fetchData()
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
    <ChatContext.Provider value={{ chats, setChats, selectedChat, setSelectedChat, sendMessage, receiveMessage, fetchData }}>
      {children}
    </ChatContext.Provider>
  );
};
