import { Box, VStack, Text, Avatar } from "@chakra-ui/react";
import { chatData } from "../chat-data";

const ChatItem = ({ name, message, date, avatarUrl, seen }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      px="4"
      py="2"
      _hover={{ bg: "gray.100", cursor: "pointer" }}
    >
      <Avatar size="md" name={name} src={avatarUrl} mr="4" />
      <Box flex="1">
        <Text fontWeight="bold">{name}</Text>
        <Text fontSize="sm" color={seen ? "gray.500" : "black"} noOfLines={1}>
          {message}
        </Text>
      </Box>
      <Text fontSize="xs" color="gray.500">
        {date}
      </Text>
    </Box>
  );
};

const ChatList = () => {
  return (
    <VStack spacing="0" align="stretch">
      {chatData.map((chat, index) => (
        <ChatItem
          key={index}
          name={chat.name}
          message={chat.message}
          date={chat.date}
          avatarUrl={chat.src}
          seen={chat.seen}
        />
      ))}
    </VStack>
  );
};

export default ChatList;
