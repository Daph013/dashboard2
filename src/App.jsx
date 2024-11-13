import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './components/Home'
import Footer from './components/Footer'
import './App.css'
import Autores from './pages/Autores'
import Canciones from './pages/Canciones'
import Generos from './pages/Generos'
import Visitantes from './pages/Visitantes'

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }


  

  return (
    <BrowserRouter>
     <div className='grid-container'>
        <Header OpenSidebar={OpenSidebar}/>
        <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
     
      <Routes>
        <Route path='/' element={<Home/>}/>
   
        <Route path='/Autores' element={<Autores/>}/>
        <Route path='/Canciones' element={<Canciones/>}/>
        <Route path='/Generos' element={<Generos/>}/>
        <Route path='/Visitantes' element={<Visitantes/>}/>
       
      </Routes>
 </div>

      <Footer/>
    
    </BrowserRouter>
      
      
  

  )
}

export default App
