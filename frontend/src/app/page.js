'use client'
import { Box } from '@chakra-ui/react'
import Hero from '../components/hero'
import Qualities from '../components/qualities'
import Contact from '../components/contact'

export default function Landing() {
  return (
    <Box>
      <Hero />
      <Qualities />
      <Contact />
    </Box>
  )
}