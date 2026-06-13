import Hero from '../components/home/Hero'
import Stats from '../components/home/Stats'
import PopularRoutes from '../components/home/PopularRoutes'
import FeaturedAirlines from '../components/home/FeaturedAirlines'
import AIAssistant from '../components/ai/AIAssistant'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <PopularRoutes />
      <FeaturedAirlines />
      <AIAssistant />
    </main>
  )
}
