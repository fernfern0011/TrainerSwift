'use client'

import {
  Flex,
  Box,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button
} from '@chakra-ui/react'

function PackageCard() {
  return (
    <Flex p={50} w="full" alignItems="center" justifyContent="center">
      <Box
        bg={useColorModeValue('white', 'gray.800')}
        maxW="sm"
        borderWidth="1px"
        rounded="lg"
        shadow="lg"
        position="relative">
        <Box p="6">
          <Flex mt="1" justifyContent="space-between" alignContent="center">
            <Box
              fontSize="2xl"
              fontWeight="semibold"
              as="h4"
              lineHeight="tight"
              isTruncated>
            Cruel Summer Yoga Package
            </Box>
          </Flex>                
          <Flex justifyContent="space-between" alignContent="center">
          <Accordion allowMultiple>
                <AccordionItem>
                    <AccordionButton>
                    <Flex justifyContent="space-between" alignContent="center">
                    <Box mr={15}>
                        <Box>Day: Monday</Box>
                        <Box>Location: To be Discussed</Box>
                    </Box>
                    </Flex>
                    <Box fontSize="2xl" ml={15} color={useColorModeValue('gray.800', 'white')}>
                        <Box as="span" color={'gray.600'} fontSize="lg">
                            $
                        </Box>
                        120
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

            {/* <Box>
                <Box>Day: Monday</Box>
                <Box>Location: To be Discussed</Box>
            </Box>
            <Box fontSize="2xl" color={useColorModeValue('gray.800', 'white')}>
              <Box as="span" color={'gray.600'} fontSize="lg">
                $
              </Box>
              120
            </Box> */}
          </Flex>
        </Box>
      </Box>
      
    </Flex>
  )
}

export default PackageCard