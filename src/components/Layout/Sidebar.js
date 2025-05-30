import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  FaHome, 
  FaFileAlt, 
  FaCalendarAlt, 
  FaRestroom, 
  FaSignOutAlt, 
  FaChevronDown,
  FaChartLine

} from 'react-icons/fa';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [reportsSubmenuOpen, setReportsSubmenuOpen] = useState(false);
  const [comiteSubmenuOpen, setComiteSubmenuOpen] = useState(false);

  const toggleReportsSubmenu = () => {
    setReportsSubmenuOpen(!reportsSubmenuOpen);
  };

  const toggleComiteSubmenu = () => {
    setComiteSubmenuOpen(!comiteSubmenuOpen);
  };

  const handleLogout = () => {
    try {
      logout()
        .then(() => {
          console.log("Déconnexion réussie");
          navigate('/login');
        })
        .catch(error => {
          console.error("Erreur lors de la déconnexion:", error);
        });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-700 to-blue-500 text-white w-64 space-y-6 py-7 px-3 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out overflow-y-auto shadow-xl">
      <div className="flex items-center space-x-2 px-4 border-b border-blue-400 pb-4">
        <div className="bg-white p-2 rounded-full">
          <FaFileAlt className="h-5 w-5 text-blue-700" />
        </div>
        <span className="text-xl font-extrabold tracking-wider">GPNS</span>
      </div>
      
      <nav className="space-y-1">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 rounded-lg transition duration-200 ${isActive ? 'bg-blue-800 shadow-md' : 'hover:bg-blue-600'}`  
          }
        >
          <FaHome className="h-5 w-5 mr-3" />
          Tableau de bord
        </NavLink>
        
        <div className="relative">
          <button 
            onClick={toggleReportsSubmenu}
            className={`flex items-center justify-between w-full text-left py-3 px-4 rounded-lg transition duration-200 ${reportsSubmenuOpen ? 'bg-blue-800' : 'hover:bg-blue-600'}`}
          >
            <div className="flex items-center">
              <FaFileAlt className="h-5 w-5 mr-3" />
              Comptes rendus
            </div>
            <FaChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${reportsSubmenuOpen ? 'transform rotate-180' : ''}`}
            />
          </button>
          
          <div 
            className={`pl-12 space-y-1 overflow-hidden transition-all duration-200 ${reportsSubmenuOpen ? 'max-h-64 mt-1 mb-2' : 'max-h-0'}`}
          >
            <NavLink 
              to="/reports/vacations" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded-lg transition duration-200 ${isActive ? 'bg-blue-800 shadow-md' : 'hover:bg-blue-600 text-blue-100'}`}
            >
              Vacations
            </NavLink>
            <NavLink 
              to="/reports/remise-en-etat" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded-lg transition duration-200 ${isActive ? 'bg-blue-800 shadow-md' : 'hover:bg-blue-600 text-blue-100'}`}
            >
              Remise en état
            </NavLink>
            <NavLink 
              to="/reports/mecanisation" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded-lg transition duration-200 ${isActive ? 'bg-blue-800 shadow-md' : 'hover:bg-blue-600 text-blue-100'}`}
            >
              Mécanisation
            </NavLink>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={toggleComiteSubmenu}
            className={`flex items-center justify-between w-full text-left py-3 px-4 rounded-lg transition duration-200 ${comiteSubmenuOpen ? 'bg-blue-800' : 'hover:bg-blue-600'}`}
          >
            <div className="flex items-center">
              <FaChartLine className="h-5 w-5 mr-3" />
              Comité de suivi
            </div>
            <FaChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${comiteSubmenuOpen ? 'transform rotate-180' : ''}`}
            />
          </button>

          <div 
            className={`pl-12 space-y-1 overflow-hidden transition-all duration-200 ${comiteSubmenuOpen ? 'max-h-64 mt-1 mb-2' : 'max-h-0'}`}
          >
            <NavLink 
              to="/comite/comiteavril25" 
              className={({ isActive }) => 
                `block py-2 px-4 rounded-lg transition duration-200 ${isActive ? 'bg-blue-800 shadow-md' : 'hover:bg-blue-600 text-blue-100'}`}
            >
              Avril 2025
            </NavLink>
          </div>
        </div>

        <NavLink 
          to="/calendar" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 rounded-lg transition duration-200 ${isActive ? 'bg-blue-800 shadow-md' : 'hover:bg-blue-600'}`}
        >
          <FaCalendarAlt className="h-5 w-5 mr-3" />
          Calendrier
        </NavLink>
        
        <NavLink 
          to="/bs" 
          className={({ isActive }) => 
            `flex items-center py-3 px-4 rounded-lg transition duration-200 ${isActive ? 'bg-blue-800 shadow-md' : 'hover:bg-blue-600'}`}
        >
          <FaRestroom className="h-5 w-5 mr-3" />
          Blocs Sanitaires
        </NavLink>
      </nav>
      
      <div className="px-4 mt-auto pt-6">
        <button 
          onClick={handleLogout}
          className="w-full bg-white text-blue-700 hover:bg-gray-100 py-2.5 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center"
        >
          <FaSignOutAlt className="h-5 w-5 mr-2" />
          Déconnexion
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
