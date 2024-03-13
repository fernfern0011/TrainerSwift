import { Providers } from "./Providers"
import Navbar from "../components/navbar"
import Footer from "../components/footer"


export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
