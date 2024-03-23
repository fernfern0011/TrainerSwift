import { Box, Flex } from "@chakra-ui/react";
import Header from "./Header";
import SearchPanel from "./SearchPanel";
import ChatList from "./ChatList";

const LeftPanel = () => {
  return (
    <Flex direction="column" w="30%">
      <Box>
        <Header />
        <SearchPanel />
      </Box>
      <ChatList flex="1" overflow="auto" />
    </Flex>
  );
};

export default LeftPanel;
