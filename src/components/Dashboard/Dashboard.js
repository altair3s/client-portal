// Fichier: src/components/Dashboard/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';
import StatCard from './StatCard';
import { FaClipboardCheck, FaCalendarAlt, FaToilet } from 'react-icons/fa';

const Dashboard = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [sanitaryStats, setSanitaryStats] = useState({ completed: 0, total: 0 });
  const [tomorrowEvents, setTomorrowEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Charger les données
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Récupérer les derniers comptes rendus
        const SHEET_ID_CR = process.env.REACT_APP_REPORTS_SHEET_ID_CR;
        const SHEET_ID_MECA = process.env.REACT_APP_REPORTS_SHEET_ID_MECA;
        const SHEET_ID_REM = process.env.REACT_APP_REPORTS_SHEET_ID_REM;
        const SHEET_ID_BS = process.env.REACT_APP_REPORTS_SHEET_ID_BS;
        const SHEET_ID_CAL = process.env.REACT_APP_SHEET_ID_CAL;
        const API_KEY = process.env.REACT_APP_API_KEY;
        
        // Récupérer les données des comptes rendus et du calendrier
        const [vacationsRes, mecaRes, remRes, bsDataRes, bsListRes, calRes] = await Promise.all([
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_CR}/values/PdfR!D1:G?key=${API_KEY}`),
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_MECA}/values/Pdf!B1:E?key=${API_KEY}`),
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_REM}/values/Pdf!B1:D?key=${API_KEY}`),
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_BS}/values/Data!A1:G?key=${API_KEY}`),
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_BS}/values/BS!A1:C?key=${API_KEY}`),
          fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_CAL}/values/Calendrier!B1:G?key=${API_KEY}`)
        ]);
        
        const [vacationsData, mecaData, remData, bsData, bsList, calData] = await Promise.all([
          vacationsRes.json(),
          mecaRes.json(),
          remRes.json(),
          bsDataRes.json(),
          bsListRes.json(),
          calRes.json()
        ]);

        // Traiter les données des comptes-rendus
        const latestReports = [];
        
        // Traiter les vacations
        if (vacationsData.values && vacationsData.values.length > 1) {
          const headers = vacationsData.values[0];
          const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
          
          // Trier par date et prendre le plus récent
          const sortedVacations = [...vacationsData.values.slice(1)].sort((a, b) => {
            if (!a[dateIndex] || !b[dateIndex]) return 0;
            const partsA = a[dateIndex].split('/');
            const partsB = b[dateIndex].split('/');
            if (partsA.length !== 3 || partsB.length !== 3) return 0;
            
            const dateA = new Date(partsA[2], partsA[1]-1, partsA[0]);
            const dateB = new Date(partsB[2], partsB[1]-1, partsB[0]);
            return dateB - dateA; // Du plus récent au plus ancien
          });
          
          if (sortedVacations.length > 0) {
            latestReports.push({
              date: sortedVacations[0][dateIndex] || '',
              type: 'Vacation',
              url: sortedVacations[0].find(cell => cell && cell.includes('http')) || ''
            });
          }
        }
        
        // Traiter les mécanisations
        if (mecaData.values && mecaData.values.length > 1) {
          const headers = mecaData.values[0];
          const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
          
          // Trier par date et prendre le plus récent
          const sortedMeca = [...mecaData.values.slice(1)].sort((a, b) => {
            if (!a[dateIndex] || !b[dateIndex]) return 0;
            const partsA = a[dateIndex].split('/');
            const partsB = b[dateIndex].split('/');
            if (partsA.length !== 3 || partsB.length !== 3) return 0;
            
            const dateA = new Date(partsA[2], partsA[1]-1, partsA[0]);
            const dateB = new Date(partsB[2], partsB[1]-1, partsB[0]);
            return dateB - dateA; // Du plus récent au plus ancien
          });
          
          if (sortedMeca.length > 0) {
            latestReports.push({
              date: sortedMeca[0][dateIndex] || '',
              type: 'Mécanisation',
              url: sortedMeca[0].find(cell => cell && cell.includes('http')) || ''
            });
          }
        }
        
        // Traiter les remises en état
        if (remData.values && remData.values.length > 1) {
          const headers = remData.values[0];
          const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
          
          // Trier par date et prendre le plus récent
          const sortedRem = [...remData.values.slice(1)].sort((a, b) => {
            if (!a[dateIndex] || !b[dateIndex]) return 0;
            const partsA = a[dateIndex].split('/');
            const partsB = b[dateIndex].split('/');
            if (partsA.length !== 3 || partsB.length !== 3) return 0;
            
            const dateA = new Date(partsA[2], partsA[1]-1, partsA[0]);
            const dateB = new Date(partsB[2], partsB[1]-1, partsB[0]);
            return dateB - dateA; // Du plus récent au plus ancien
          });
          
          if (sortedRem.length > 0) {
            latestReports.push({
              date: sortedRem[0][dateIndex] || '',
              type: 'Remise en état',
              url: sortedRem[0].find(cell => cell && cell.includes('http')) || ''
            });
          }
        }
        
        setRecentReports(latestReports);
        
        // Traiter les données des blocs sanitaires
        if (bsData.values && bsData.values.length > 1 && bsList.values && bsList.values.length > 1) {
          const today = new Date().toLocaleDateString('fr-FR'); // Format: JJ/MM/YYYY
          const headers = bsData.values[0];
          const dateIndex = 6; // Colonne G (index 6) contient la date
          
          // Vérifier le format des dates et filtrer pour aujourd'hui
          const todayEntries = bsData.values.slice(1).filter(row => {
            return row.length > dateIndex && row[dateIndex] && row[dateIndex].trim() === today;
          });
          
          // Nombre total de blocs sanitaires depuis la feuille BS
          const totalBlocks = bsList.values.slice(1).length;
          
          // Nombre de blocs traités aujourd'hui
          const completedBlocks = todayEntries.length;
          
          setSanitaryStats({
            completed: completedBlocks,
            total: totalBlocks,
            percentage: totalBlocks > 0 ? Math.round((completedBlocks / totalBlocks) * 100) : 0
          });
          
          console.log('BS Stats:', {
            date: today,
            totalBlocks,
            completedBlocks,
            todayEntries
          });
        }
        
        // Traiter les données du calendrier pour demain
        if (calData.values && calData.values.length > 1) {
          const headers = calData.values[0];
          const dateIndex = headers.findIndex(h => h.toLowerCase().includes('date'));
          const siteIndex = headers.findIndex(h => h.toLowerCase().includes('site'));
          const infraIndex = headers.findIndex(h => h.toLowerCase().includes('infra'));
          
          // Obtenir la date de demain au format JJ/MM/YYYY
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const tomorrowFormatted = tomorrow.toLocaleDateString('fr-FR');
          
          // Filtrer les entrées pour demain
          const tomorrowTasks = calData.values.slice(1).filter(row => 
            row[dateIndex] && row[dateIndex] === tomorrowFormatted
          );
          
          // Transformer les données pour l'affichage
          const formattedTasks = tomorrowTasks.map(row => ({
            site: row[siteIndex] || 'Non spécifié',
            infra: row[infraIndex] || 'Non spécifié',
            details: row.length > 5 ? row[5] : ''
          }));
          
          // Mettre à jour l'état avec les tâches pour demain
          setTomorrowEvents(formattedTasks);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des données du tableau de bord:", err);
        setError("Impossible de charger les données. Veuillez réessayer ultérieurement.");
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
  
  if (error) return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      {error}
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Tableau de bord</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center mb-4">
            <FaClipboardCheck className="text-white text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-bold">Comptes rendus récents</h2>
              <p className="text-blue-100">Total: {recentReports.length}</p>
            </div>
          </div>
          <div className="text-4xl font-bold">{recentReports.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center mb-4">
            <FaCalendarAlt className="text-white text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-bold">Interventions à venir</h2>
              <p className="text-green-100">Pour demain</p>
            </div>
          </div>
          <div className="text-4xl font-bold">{tomorrowEvents.length}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center mb-4">
            <FaToilet className="text-white text-3xl mr-4" />
            <div>
              <h2 className="text-xl font-bold">Blocs sanitaires</h2>
              <p className="text-purple-100">Traités aujourd'hui</p>
            </div>
          </div>
          <div className="text-4xl font-bold">
            {sanitaryStats.percentage}%
            <span className="text-sm ml-2">({sanitaryStats.completed}/{sanitaryStats.total})</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Comptes rendus récents</h2>
            <Link to="/reports/all" className="text-sm text-blue-600 hover:text-blue-900">
              Voir tout
            </Link>
          </div>
          
          {recentReports.length === 0 ? (
            <p className="text-gray-500">Aucun compte rendu disponible</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {recentReports.map((report, index) => (
                <li key={index} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium">{report.type}</p>
                    <p className="text-sm text-gray-500">{report.date}</p>
                  </div>
                  
                  {report.url && (
                    <a 
                      href={report.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Voir PDF
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Interventions à venir</h2>
            <Link to="/calendar" className="text-sm text-blue-600 hover:text-blue-900">
              Voir le calendrier
            </Link>
          </div>
          
          <div className="mt-4">
            {tomorrowEvents.length === 0 ? (
              <div className="text-center text-gray-500">
                <p>Aucune intervention planifiée pour demain</p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-center mb-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600">{tomorrowEvents.length}</p>
                    <p className="text-gray-600 mt-2">interventions planifiées pour demain</p>
                  </div>
                </div>
                
                <ul className="divide-y divide-gray-200">
                  {tomorrowEvents.map((event, index) => (
                    <li key={index} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{event.site}</p>
                          <p className="text-sm text-gray-500">{event.infra}</p>
                        </div>
                        {event.details && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            {event.details}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">État des blocs sanitaires</h2>
          <Link to="/bs" className="text-sm text-blue-600 hover:text-blue-900">
            Détails
          </Link>
        </div>
        
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                  Progression
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-purple-600">
                  {sanitaryStats.percentage}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
              <div 
                style={{ width: `${sanitaryStats.percentage}%` }} 
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
              ></div>
            </div>
            <p className="text-gray-600 text-sm">
              {sanitaryStats.completed} blocs sur {sanitaryStats.total} ont été nettoyés aujourd'hui.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;