'use client';

import { Avatar, Flex, IconButton, Tooltip } from '@chakra-ui/react';
import { BellIcon, ChatIcon, SettingsIcon } from '@chakra-ui/icons';

const Header = () => {
  return (
    <Flex
      bg="gray.100"
      justify="space-between"
      align="center"
      py="2"
      px="4"
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Avatar size="sm" name="John Doe" src="https://bit.ly/dan-abramov" />
      <Flex>
        <Tooltip label="Notifications" placement="bottom">
          <IconButton
            variant="ghost"
            icon={<BellIcon />}
            aria-label="Notifications"
            mr="2"
          />
        </Tooltip>
        <Tooltip label="New Chat" placement="bottom">
          <IconButton
            variant="ghost"
            icon={<ChatIcon />}
            aria-label="New Chat"
            mr="2"
          />
        </Tooltip>
        <Tooltip label="Settings" placement="bottom">
          <IconButton
            variant="ghost"
            icon={<SettingsIcon />}
            aria-label="Settings"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Header;