import React from 'react'
import Navbar from './Landing/Navbar'
import Bumi3d from './Landing/components/Bumi3d'
import Hero from './Landing/Hero'
import About from './Landing/About'
import IdentifikasiSampah from './Landing/IdentifikasiSampah'

const App = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <IdentifikasiSampah />
    </main>
  )
}

export default App
