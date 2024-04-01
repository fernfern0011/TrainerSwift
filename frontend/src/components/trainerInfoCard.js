"use client"

import { Card, Image, Stack, CardBody, Heading, Text, CardFooter, Button, Box, Spinner } from '@chakra-ui/react';
import { ArrowForwardIcon } from '@chakra-ui/icons';
import Link from 'next/link';

export default function TrainerInfoCard(data) {
  const birth = new Date(data.dob);
  const ageDate = new Date(Date.now() - birth.getTime());
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  return (
    <Box m={'auto'} width={'full'}>
      <Card
        direction={{ base: 'column', sm: 'row' }}
        overflow='hidden'
        variant='outline'
        justifyContent={'space-between'}
        id={data.trainerid}
      >
        <Stack>
          <CardBody>
            <Heading size='md'>{data.name}</Heading>
            <Text py='2' noOfLines={[3]} pb={0}>
              {data.bio}
            </Text>
          </CardBody>

          <CardFooter>
            <Link href={{
              pathname: `/trainer/${data.trainerid}`
            }}>
              <Button variant='solid' colorScheme='red'>
                Check Packages
                <ArrowForwardIcon mt={0.5} ml={1} />
              </Button>
            </Link>
          </CardFooter>
        </Stack>

        <Image
          objectFit='cover'
          maxW={{ base: '100%', sm: '200px' }}
          src={'https://placehold.co/200x200'}
          // src={data.image != '' ? data.image : 'https://placehold.co/200x200'}
          alt='Caffe Latte'
        />
      </Card>
    </Box>
  );
}
