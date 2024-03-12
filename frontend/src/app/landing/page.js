import React from 'react'
import { Box } from '@chakra-ui/react'
import Hero from '../../components/hero'
import Qualities from '../../components/qualities'
import Contact from '../../components/contact'



const Landing = () => {
    return (
      <Box>
          <Hero/>
          <Qualities/>
          <Contact/>
      </Box>
    )
  }
  
  export default Landing