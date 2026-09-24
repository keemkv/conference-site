import Header from './components/Header'
import Hero from './components/Hero'
import Program from './components/Program'
import Speakers from './components/Speakers'
import Payment from './components/Payment'
import Contacts from './components/Contacts'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="min-h-screen font-body">
      <Header />
      <main>
        <Hero />
        <Program />
        <Speakers />
        <Payment />
        <Contacts />
      </main>
      <Footer />
    </div>
  )
}
