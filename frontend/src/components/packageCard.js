'use client'

import React, { useState } from 'react'
import {
  Flex,
  Box,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useToast,
  Spinner,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
import Link from 'next/link';

export default function PackageCard(data) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  return (
    <Flex p={50} w="full">
      {loading ? <Spinner /> :
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">
          <Box p="6">
            <Flex mt="1" justifyContent="space-between">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                {data.name}
              </Box>
            </Flex>
            <Flex justifyContent="space-between">
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Flex justifyContent="space-between">
                      <UnorderedList>
                        <ListItem>Day: {data.day ? data.day : 'To Be Updated'}</ListItem>
                        <ListItem>Mode: {data.mode}</ListItem>
                        <ListItem>Location: {data.address ? data.address : 'To Be Updated'}</ListItem>
                      </UnorderedList>
                    </Flex>
                    <Box fontSize="2xl" ml={15} color={useColorModeValue('gray.800', 'white')}>
                      ${data.price}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    Timeslots Available:
                    <Button mr={2} bg={'blue.300'}>8:00 AM</Button>
                    <Button mr={2} bg={'blue.300'}>9:00 AM</Button>
                    <Button mr={2} bg={'blue.300'}>10:00 AM</Button>
                    <Button mr={2} bg={'blue.300'}>11:00 AM</Button>
                    <Button mr={2} bg={'blue.300'}>12:00 PM</Button>
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </Flex>
          </Box>
        </Box>
      }
    </Flex>
  )
}