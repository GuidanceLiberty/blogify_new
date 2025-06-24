import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

const App = ({ children }) => {

  return (
    <main className=''>
      <div className="min-h-[2.3rem]">
        <Navbar />
      </div>
      
      <div className="container mx-auto !mt-14">  
        {children}
      </div>
      
      <Footer />
    </main>
  )
}

export default App
