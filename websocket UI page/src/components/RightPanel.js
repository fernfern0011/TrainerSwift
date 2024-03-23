import { Center, Flex, Box, Heading, Text } from "@chakra-ui/react";

const RightPanel = () => {
  return (
    <Center bg="gray.100" w="70%">
      <Flex direction="column" textAlign="center" color="gray.600">
        <Box>
          <Heading size="lg">Welcome to Chat App</Heading>
          <Text mt="4">Select a chat to start messaging.</Text>
        </Box>
      </Flex>
    </Center>
  );
};

export default RightPanel;
