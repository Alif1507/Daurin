import React from 'react'
import Navbar from './Landing/Navbar'
import Bumi3d from './Landing/components/Bumi3d'
import Hero from './Landing/Hero'
import About from './Landing/About'
import IdentifikasiSampah from './Landing/IdentifikasiSampah'
import AyoEdukasi from './Landing/AyoEdukasi'
import R3 from './Landing/R3'
import GameAndQuiz from './Landing/GameAndQuiz'
import LihatKarya from './Landing/LihatKarya'
import AiBot from './Landing/AiBot'
import Footer from './Landing/Footer'

const App = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <IdentifikasiSampah />
      <AyoEdukasi />
      <R3 />
      <GameAndQuiz />
      <LihatKarya />
      <AiBot />
      <Footer />
    </main>
  )
}

export default App
