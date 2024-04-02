'use client';

import React from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Center,
  Text
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons';
import Link from 'next/link'
import Cookies from 'js-cookie'

const Links = [
  { text: 'Search Trainer', route: '/search-trainer' },
  { text: 'My Bookings', route: '/my-bookings' }
];
const NavLink = ({ text, route }) => {
  return (
    <Link href={route} passHref>
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
        bg: useColorModeValue('red.900', 'red.900'),
      }}
    >
      {text}
    </Box>
  </Link>
  );
};

export default function TraineeNavbar(traineeinfo) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    // clear session cookie
    Cookies.remove('token');
    Cookies.remove('traineeinfo')

    // redirect to the main page
    window.location.href = '/'
  };

  return (
    <>
      <Box bg={useColorModeValue('red.900', 'red.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <Link href={'/'}>
              <Box color={'white'}>
                Trainer Swift
              </Box>
            </Link>
            <HStack color={'white'} as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {Links.map(({text, route}) => (
                <NavLink key={text} text={text} route={route} />
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <Stack direction={'row'} spacing={7}>
              <Menu>
                <MenuButton
                  as={Button}
                  rounded={'full'}
                  variant={'link'}
                  cursor={'pointer'}
                  minW={0}
                  _hover={{ textDecoration: 'none' }}>
                  <Flex alignItems="center" flexDirection="row">
                    <Text color={'white'} mr={'10px'}>{traineeinfo.name}</Text>
                    <Avatar
                      size={'sm'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Flex>
                </MenuButton>
                <MenuList alignItems={'center'}>
                  <br />
                  <Center>
                    <Avatar
                      size={'2xl'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </Center>
                  <br />
                  <Center>
                    <p>{traineeinfo.name}</p>
                  </Center>
                  <br />
                  <MenuDivider />
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
