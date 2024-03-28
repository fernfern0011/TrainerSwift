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
  ButtonGroup,
  Button,
  IconButton,
  useToast,
  Spinner,
  UnorderedList,
  ListItem,
  Text,
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import Link from 'next/link';
import { DeleteIcon } from '@chakra-ui/icons';

export default function PackageCard(data) {
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  console.log(data);

  return (
    <Flex w="full" justifyContent={'space-around'}>
      {loading ? <Spinner /> :
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          w={'100%'}
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">
          <Box>
            <Flex direction={'column'} p={"6"} bgColor={'gray.50'} minH={'210px'}>
              {data.ispremium ? (<Tag
                size={'md'}
                maxWidth={'fit-content'}
                colorScheme='yellow'
              >
                <TagLabel>Premium</TagLabel>
              </Tag>) : ''}
              <Flex mt="1" justifyContent="space-between">
                <Box
                  fontSize="24px"
                  fontWeight="semibold"
                  lineHeight="tight"
                  isTruncated>
                  {data.name}
                </Box>
              </Flex>

              {/* Package Details */}
              <Flex justifyContent="space-between">
                <UnorderedList>
                  <ListItem><b>Day:</b> {data.day ? data.day : 'To Be Updated'}</ListItem>
                  <ListItem><b>Mode:</b> {data.mode}</ListItem>
                  <ListItem><b>Location:</b> {data.address ? data.address : 'To Be Updated'}</ListItem>
                  <ListItem><b>Detail:</b> {data.detail}</ListItem>
                </UnorderedList>
                <Box fontSize="22px" ml={15}>
                  ${data.price}
                </Box>
              </Flex>
            </Flex>

            {/* Package timeslots */}
            {data.timeslots.length != 0 ? (
              <Accordion allowMultiple>
                <AccordionItem>
                  <AccordionButton>
                    <Text mb={'5px'}>Timeslots Available:</Text>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    {(data.timeslots).sort(function (a, timeslot) { return a.availabilityid - timeslot.availabilityid }).map((timeslot) =>
                    (
                      <ButtonGroup size='sm' isAttached mr={'10px'} key={timeslot.availabilityid} >
                        <Button variant='outline' colorScheme='blue' mr={2}>{timeslot.time}</Button>
                        <IconButton colorScheme='red' aria-label='Delete timeslot' icon={<DeleteIcon />} />
                      </ButtonGroup>
                    )
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>) :
              (<Text color={"red"} width={'fit-content'} m={'auto'} pt={'50px'}>No timeslots</Text>)}
          </Box>
        </Box>
      }
    </Flex>
  )
}