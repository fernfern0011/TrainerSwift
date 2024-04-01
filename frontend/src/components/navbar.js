'use client'

import {
  Box,
  Flex,
  Button,
  useColorModeValue,
  Stack,
} from '@chakra-ui/react'
import Link from 'next/link'

export default function Navbar() {

  return (
    <Box bg={useColorModeValue('red.900', 'red.900')} zIndex={'5'} px={4} top={'0'} position={'sticky'}>

      {/* Default */}
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Link href={'/'}>
          <Box color={'white'}>
            Trainer Swift
          </Box>
        </Link>
        <Flex alignItems={'center'}>
          <Stack direction={'row'} spacing={7}>
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={'flex-end'}
              direction={'row'}
              spacing={6}>
              <Button
                as={'a'}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'black'}
                bg={'white'}
                href={'/login'}
                _hover={{
                  bg: 'pink.300',
                  color: 'white'
                }}>
                Sign In
              </Button>
              <Button
                as={'a'}
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'black'}
                bg={'white'}
                href={'/register'}
                _hover={{
                  bg: 'pink.300',
                  color: 'white'
                }}>
                Sign Up
              </Button>
            </Stack>
          </Stack>
        </Flex>
      </Flex>
    </Box>
  )
}