import { Flex } from '@chakra-ui/react';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const Layout = () => {
  return (
    <Flex h="100vh">
      <LeftPanel />
      <RightPanel />
    </Flex>
  );
};

export default Layout;