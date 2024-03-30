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
  Text,
  Tag,
  TagLabel,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation'

export default function PackageCard(data) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const handleDelete = async (packageid) => {
    setLoading(true)

    const response = await fetch('http://localhost:3000/api/package', {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        {
          packageid: packageid
        })
    })

    // if post successfully deleted
    const result = await response.json()

    if (result.code == 200) {
      setLoading(false)

      // whenever post is successfully deleted
      toast({
        title: 'Package is deleted.',
        status: 'success',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      })

    } else {
      setLoading(false)

      // whenever post is failed to delete
      toast({
        title: 'Failed to delete package. Package is not empty',
        status: 'error',
        position: 'top-right',
        duration: 5000,
        isClosable: true,
      })
    }
  }


  return (
    <Flex w={"full"} justifyContent={'space-around'}>
      {loading ? <Spinner m={'auto'} /> :
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          w={'100%'}
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">
          <Box>
            <Flex direction={'column'} p={"6"} bgColor={'gray.50'} minH={'210px'}>
              <Flex direction={'row'} justifyContent={'end'} mb={'15px'}>
                <EditIcon boxSize={5} mr={'15px'} cursor={'pointer'} onClick={() => router.push(`/package/${data.packageid}?name=${data.name}&postid=${data.postid}&title=${data.title}`)} />
                <DeleteIcon boxSize={5} onClick={() => handleDelete(data.packageid)} cursor={'pointer'} />
              </Flex>
              <Flex mt="1">
                <Box
                  mr={'10px'}
                  fontSize="24px"
                  fontWeight="semibold"
                  lineHeight="tight"
                  isTruncated>
                  {data.name}
                </Box>
                {data.ispremium ? (<Tag
                  size={'md'}
                  maxWidth={'fit-content'}
                  colorScheme='yellow'
                >
                  <TagLabel>Premium</TagLabel>
                </Tag>) : ''}
              </Flex>

              {/* Package Details */}
              <Flex justifyContent="space-between">
                <UnorderedList>
                  <ListItem><b>Day:</b> {data.day ? data.day : 'To Be Updated'}</ListItem>
                  <ListItem><b>Mode:</b> {data.mode}</ListItem>
                  <ListItem><b>Location:</b> {data.address ? data.address : 'To Be Updated'}</ListItem>
                  <ListItem><b>Detail:</b> {data.detail}</ListItem>
                </UnorderedList>
                <Box fontSize="22px" ml={25}>
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
                      <Button variant='outline' colorScheme='blue' mr={2} key={timeslot.availabilityid} >{timeslot.time}</Button>
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