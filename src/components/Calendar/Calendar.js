import React, { useState, useEffect } from 'react';
import CalendarMonthView from './CalendarMonthView';

const Calendar = () => {
  const [deployments, setDeployments] = useState([]); // Gérer les données du calendrier localement
  const [filter, setFilter] = useState('all');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  // Filtrer les déploiements par statut
  const filteredDeployments = deployments.filter(deployment => {
    return filter === 'all' || deployment.status === filter;
  });

  const handlePreviousMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

// Fonction pour convertir la date au format dd/mm/yyyy en objet Date
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('/');  // Diviser la chaîne en jour, mois, année
  return new Date(`${year}-${month}-${day}`);  // Créer une date au format yyyy-mm-dd
};

const fetchSheetData = async () => {
  const SHEET_ID_CAL = process.env.REACT_APP_SHEET_ID_CAL;
  const API_KEY = process.env.REACT_APP_API_KEY;
  const RANGE = 'Calendrier!B1:G';  // Plage des colonnes Date, Site, Infra, Début, Fin, Détails

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_CAL}/values/${RANGE}?key=${API_KEY}`
    );
    const result = await response.json();
    
    if (result.values) {
      // Mapper les données en fonction du format attendu par le composant Calendar
      const parsedData = result.values.slice(1).map(row => {
        const date = parseDate(row[0]);  // Convertir la date en objet Date

        // Vérification si la date est valide
        if (isNaN(date.getTime())) {
          console.warn('Date invalide pour:', row[0]);
          return {
            date: new Date(),  // Si la date est invalide, utiliser la date actuelle
            site: row[1],
            infra: row[2],
            start: row[3],
            end: row[4],
            details: row[5],
            status: 'Planifié'
          };
        }

        return {
          date,               // Date valide
          site: row[1],       // Site
          infra: row[2],      // Infra
          start: row[3],      // Début
          end: row[4],        // Fin
          details: row[5],    // Détails
          status: 'Planifié'  // Ajoute un statut par défaut
        };
      });

      setDeployments(parsedData);  // Mettre à jour l'état local avec les déploiements
    } else {
      setError('Aucune donnée trouvée');
    }
  } catch (err) {
    setError("Une erreur est survenue lors de la récupération des données.");
  } finally {
    setLoading(false);  // Fin du chargement
  }
};



  useEffect(() => {
    fetchSheetData();  // Charger les données du calendrier au démarrage
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Calendrier de déploiement</h1>
        
        <div className="flex space-x-2">
          <select 
            className="bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="Terminé">Terminés</option>
            <option value="En cours">En cours</option>
            <option value="Planifié">Planifiés</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={handlePreviousMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <h2 className="text-xl font-semibold">
            {months[month]} {year}
          </h2>
          
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <CalendarMonthView 
            month={month} 
            year={year} 
            deployments={filteredDeployments} 
          />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
