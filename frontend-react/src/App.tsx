import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useLenis } from './hooks/useLenis'
import MouseTrail from './components/effects/MouseTrail'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import HomePage from './pages/HomePage'
import FlightResultsPage from './pages/FlightResultsPage'
import LoginPage from './pages/LoginPage'

function AppInner() {
  useLenis()

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      <MouseTrail />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/flights" element={<FlightResultsPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename="/skylux-flight-booking">
      <AppInner />
    </BrowserRouter>
  )
}
