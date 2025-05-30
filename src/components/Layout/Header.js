// Fichier: src/components/Layout/Header.js
import React, { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { DataContext } from '../../contexts/DataContext';
import { getReports, getCalendarData, getSanitaryBlocksData } from '../../services/google-sheets.service';

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const { refreshData, setReports, setDeployments, setSanitaryBlocks, setLoading, setError } = useContext(DataContext);
  
  const handleRefresh = async () => {
    try {
      // Utiliser la fonction du contexte si elle existe
      if (typeof refreshData === 'function') {
        refreshData('all');
      } 
      // Sinon, implémenter une version simplifiée directement ici
      else {
        console.log("Utilisation d'une fonction de rafraîchissement locale");
        // À adapter selon les fonctions disponibles dans votre contexte
        if (typeof setLoading === 'function') setLoading(true);
        
        try {
          const [reportsData, calendarData, blocksData] = await Promise.all([
            getReports(),
            getCalendarData(),
            getSanitaryBlocksData()
          ]);
          
          if (typeof setReports === 'function') setReports(reportsData);
          
          if (typeof setDeployments === 'function') {
            const formattedCalendarData = calendarData.map(item => ({
              ...item,
              date: new Date(item.date),
              completionPercentage: parseInt(item.completionPercentage || 0)
            }));
            setDeployments(formattedCalendarData);
          }
          
          if (typeof setSanitaryBlocks === 'function') setSanitaryBlocks(blocksData);
          
        } catch (err) {
          console.error("Erreur:", err);
          if (typeof setError === 'function') setError('Erreur lors du rafraîchissement des données');
        } finally {
          if (typeof setLoading === 'function') setLoading(false);
        }
      }
    } catch (error) {
      console.error("Erreur générale lors du rafraîchissement:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Portail Client</h1>
            </div>
          </div>
          <div className="flex items-center">
            
            
            <div className="ml-4 relative flex-shrink-0">
              <div>
                <div className="flex items-center">
                  <div>
                    <img
                      className="inline-block h-9 w-9 rounded-full"
                      src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || currentUser.email}&background=random`}
                      alt={currentUser.displayName || currentUser.email}
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {currentUser.displayName || currentUser.email}
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      Client
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;