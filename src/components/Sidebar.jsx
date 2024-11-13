import {BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill} from 'react-icons/bs'
import { FaPerson } from "react-icons/fa6";
import { FaMusic } from "react-icons/fa";
import { BsMusicPlayerFill } from "react-icons/bs";
import { Link } from 'react-router-dom'

const Sidebar = ({openSidebarToggle, OpenSidebar}) => {
    return (
        <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
            <div className='sidebar-title'>
                <div className='sidebar-brand'>
                    <p>Musica</p>
                </div>
                <span className='icon close_icon' onClick={OpenSidebar}>X</span>
            </div>
    
            <ul className='sidebar-list'>
                <li className='sidebar-list-item'>
                    <Link to="/Autores">
                        <FaPerson className='icon'/> Autores
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/Generos">
                        <BsMusicPlayerFill className='icon'/> Generos
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/Canciones">
                        <FaMusic className='icon'/> Canciones
                    </Link>
                </li>
                <li className='sidebar-list-item'>
                    <Link to="/Visitantes">
                        <BsPeopleFill className='icon'/> Visitantes
                    </Link>
                </li>
               
                <li className='sidebar-list-item'>
                    <Link to="/Configuración">
                        <BsFillGearFill className='icon'/> Configuración
                    </Link>
                </li>
            </ul>
        </aside>
  )
}

export default Sidebar