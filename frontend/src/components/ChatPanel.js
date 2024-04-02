import React, { useContext, useState, useEffect, useRef } from 'react';
import { Box, Flex, Text, Input, Button } from '@chakra-ui/react';
import { ChatContext } from '../store/chatStore';
import { SourceTextModule } from 'vm';
//import { RootLayout } from "../app/layout";



const ChatMessage = ({ message }) => {
  //console.log(currentUser);
  const alignSelf = message.sender_info === "trainee7" ? 'flex-end' : 'flex-start';
  const messageColor = message.sender_info === "trainee7" ? 'blue.500' : 'red.500';
  const textColor = message.sender_info === "trainee7" ? 'white' : 'black';

  return (
    <Box
      bg={messageColor}
      color={textColor}
      borderRadius="md"
      p="2"
      maxW="70%"
      alignSelf={alignSelf}
      mb="2"
    >
      {message.message}
    </Box>
  );
};

const ChatPanel = ({}) => {
  const {chats, setChats} = useContext(ChatContext);
  const { selectedChat, sendMessage, fetchData} = useContext(ChatContext);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef(null);

  //console.log(trainerinfo, traineeinfo);
  console.log(chats)
  const sortedMessages = chats.slice().sort((a,b) => {
    const timestampA = new Date(a.timestamp);
    const timestampB = new Date(b.timestamp);
    return timestampA - timestampB;
  })
  console.log(chats)
  //console.log(selectedChat)
  console.log(sortedMessages)

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    scrollToBottom();
  }, [chats]);
  

  const handleSendMessage = () => {
    if (messageInput.trim() !== '' && selectedChat) {
      const newMessage = {
        id: Date.now().toString(),
        text: messageInput,
        sender_info: selectedChat.sender_info,
        timestamp: new Date().toISOString(),
      };

      sendMessage(newMessage);
      setMessageInput('');
      fetchData();
    }
  };


  return (
    <Flex direction="column" h="100%" p="4">
      {chats ? (
        <>
          <Box mb="4">
            <Text fontSize="xl" fontWeight="bold">
              {chats.name}
            </Text>
          </Box>
          <Box flex="1" overflowY="auto" mb="4" display="flex" flexDirection="column-reverse">
            <div ref={messagesEndRef} />
            {sortedMessages.reverse().map((message, index) => {
              const isTrainer = (message.sender_info === "trainee7");
              //console.log(message.sender_info === 'trainer113')
              return (
                <ChatMessage
                  key={index}
                  message={message}
                  isTrainer={isTrainer}
                />
              );
            })}


          </Box>
          <Flex>
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              mr="2"
            />
            <Button colorScheme="blue" onClick={handleSendMessage}>
              Send
            </Button>
          </Flex>
        </>
      ) : (
        <Box textAlign="center">
          <Text>Select a chat to start messaging.</Text>
        </Box>
      )}
    </Flex>
  );
};

export default ChatPanel;
