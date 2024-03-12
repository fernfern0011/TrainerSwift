import { Providers } from "./Providers"
import Navbar from "../components/navbar"

export default function RootLayout({children}) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Navbar/>
          {children}
        </Providers>
      </body>
    </html>
  )
}
