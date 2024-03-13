import React from 'react'
import { Box } from '@chakra-ui/react'
import Hero from '../../components/hero'
import Qualities from '../../components/qualities'
import Contact from '../../components/contact'
import PackageCard from '../../components/packageCard'



const Landing = () => {
    return (
      <Box>
          <Hero/>
          <Qualities/>
          <Contact/>
          <PackageCard/>
      </Box>
    )
  }
  
  export default Landing