"use client"
import React, { useState, useEffect } from 'react';
import PackageCard from '../../../components/packageCard';
import { Button, Image, Heading, Text, Box } from '@chakra-ui/react'
import SearchTrainer from '../search-trainer/page';
import { ChevronLeftIcon } from '@chakra-ui/icons';


export default function ViewTrainerPackage() {

    return (
        <Box>
            <Button
                borderRadius="full"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                ml={'10px'}
                mt={'-390px'}
                backgroundColor='black'
                color='white'
                as={'a'}
                href={'/view-trainer-profile'}
            >
                <ChevronLeftIcon boxSize={6} />
            </Button>
            <Box style={{ display: 'inline-block' }} mt={"25px"} ml={'25%'}>
                <Box style={{ display: 'inline-block' }}>
                    <Heading>
                        John Doe, 24
                    </Heading>
                    <Box>
                        <Text style={{ display: 'inline-block' }}>
                            Trainer ID:
                        </Text>
                        <Text ml={"5px"} style={{ display: 'inline-block' }}>
                            123456
                        </Text>
                    </Box>
                    <Box>
                        <Text style={{ display: 'inline-block' }}>
                            Expert in:
                        </Text>
                        <Text ml={"5px"} style={{ display: 'inline-block' }}>
                            Yoga, Pilates, Swimming
                        </Text>
                    </Box>
                    <Box mt={"70px"}>
                        <Heading>
                            Package
                        </Heading>
                    </Box>
                </Box>
                <Box ml={'100px'} style={{ display: 'inline-block' }}>
                    <Image
                        borderRadius='full'
                        boxSize='200px'
                        src='https://bit.ly/dan-abramov'
                        alt='Dan Abramov'
                    />
                </Box>
            </Box>
        </Box>
    );
}
