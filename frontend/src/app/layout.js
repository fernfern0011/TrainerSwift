"use client"

import { Providers } from "./Providers"
import Navbar from "../components/navbar"
import TraineeNavbar from "@/components/navbarTrainee"
import TrainerNavbar from "@/components/navbarTrainer"
import Footer from "../components/footer"
// import Cookies from 'js-cookie'
const Cookies = require('js-cookie');
import { useEffect, useState } from "react"

export default function RootLayout({ children }) {
  const [trainerinfo, setTrainerinfo] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = Cookies.get('token')
    const trainerinfo = Cookies.get('trainerinfo')
    const traineeinfo = Cookies.get('traineeinfo')

    if (!token) {
      setIsAuthenticated(false)
    }

    if (!(trainerinfo === undefined)) {
      setTrainerinfo(JSON.parse(trainerinfo));
      setIsAuthenticated(true)
    }

    if (!(traineeinfo === undefined)) {
      setIsAuthenticated(true)
    }
  }, [])

  return (
    <html lang='en'>
      <body>
        <Providers>
          {isAuthenticated == false && <Navbar />}
          {isAuthenticated === true && (
            <>
              {trainerinfo.role === 'trainer' ? <TrainerNavbar /> : <TraineeNavbar />}

            </>
          )}
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
