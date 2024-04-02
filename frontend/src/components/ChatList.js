// ChatList.js

import React, { useContext } from 'react';
import { VStack, Box, Text, Avatar } from '@chakra-ui/react';
import { ChatContext } from '../store/chatStore';

const ChatItem = ({ chat, onClick }) => {
  const lastMessage = chat.messages?.[chat.messages.length - 1];

  return (
    <Box
      display="flex"
      alignItems="center"
      px="4"
      py="2"
      _hover={{ bg: 'gray.100', cursor: 'pointer' }}
      onClick={() => onClick(chat)}
    >
      <Avatar size="md" name={chat.name} src={chat.src} mr="4" />
      <Box flex="1">
        <Text fontWeight="bold">{chat.name}</Text>
        {lastMessage && (
          <Text fontSize="sm" color={chat.seen ? 'gray.500' : 'black'} noOfLines={1}>
            {lastMessage.text}
          </Text>
        )}
      </Box>
      <Text fontSize="xs" color="gray.500">
        {chat.date}
      </Text>
    </Box>
  );
};

const ChatList = () => {
  const { chats, setSelectedChat } = useContext(ChatContext);

  // Group chats based on sender and receiver information
  const groupedChats = {};
  chats.forEach((chat) => {
    const { sender_info, receiver_info, message } = chat;
    const chatId = sender_info < receiver_info ?  `${receiver_info}_${sender_info}`:`${sender_info}_${receiver_info}` ;

    if (!groupedChats[chatId]) {
      groupedChats[chatId] = {
        id: chatId,
        name: sender_info < receiver_info ? receiver_info : sender_info,
        src: '', // Add source for Avatar image
        messages: [],
        date: '', // You might want to include date information as well
        seen: true, // Update this based on your chat data
      };
    }

    groupedChats[chatId].messages.push({ text: message, sender_info: sender_info });
  });

  // Convert groupedChats object into an array
  const formattedChats = Object.values(groupedChats);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);
  };

  return (
    <VStack spacing="0" align="stretch">
      {formattedChats.map((chat) => (
        <ChatItem
          key={chat.id} // Add a unique key prop using chat.id
          chat={chat}
          onClick={handleChatClick}
        />
      ))}
    </VStack>
  );
};

export default ChatList;
