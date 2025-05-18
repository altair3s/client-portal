import React, { createContext, useState, useEffect } from 'react';
import { 
  getReports, 
  getCalendarData, 
  getSanitaryBlocksData 
} from '../services/google-sheets.service';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [deployments, setDeployments] = useState([]);
  const [sanitaryBlocks, setSanitaryBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger les données au démarrage
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Récupérer les données
        const [reportsData, calendarData, blocksData] = await Promise.all([
          getReports(),
          getCalendarData(),
          getSanitaryBlocksData()
        ]);

        if (!isMounted) return;

        // Traiter les données du calendrier avec validation
        const formattedCalendarData = calendarData
          .filter(item => item && item.date)
          .map(item => {
            try {
              return {
                ...item,
                date: item.date ? new Date(item.date) : new Date(),
                completionPercentage: parseInt(item.completionPercentage || 0)
              };
            } catch (err) {
              console.warn('Invalid date format for calendar item:', item);
              return {
                ...item,
                date: new Date(),
                completionPercentage: parseInt(item.completionPercentage || 0)
              };
            }
          });

        // Mettre à jour l'état
        if (Array.isArray(reportsData)) setReports(reportsData);
        if (Array.isArray(formattedCalendarData)) setDeployments(formattedCalendarData);
        if (Array.isArray(blocksData)) setSanitaryBlocks(blocksData);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (isMounted) setError('Erreur lors du chargement des données');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Fonction de rafraîchissement des données
  const refreshData = async (dataType = 'all') => {
    try {
      setLoading(true);
      setError(null);

      if (dataType === 'all' || dataType === 'reports') {
        const reportsData = await getReports();
        setReports(reportsData);
      }

      if (dataType === 'all' || dataType === 'deployments') {
        const calendarData = await getCalendarData();
        const formattedCalendarData = calendarData.map(item => ({
          ...item,
          date: new Date(item.date),
          completionPercentage: parseInt(item.completionPercentage || 0)
        }));
        setDeployments(formattedCalendarData);
      }

      if (dataType === 'all' || dataType === 'sanitaryBlocks') {
        const blocksData = await getSanitaryBlocksData();
        setSanitaryBlocks(blocksData);
      }
    } catch (err) {
      console.log('Error refreshing data:', err);
      setError('Erreur lors du rafraîchissement des données');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour obtenir les statistiques
  const getStats = () => {
    const completedReports = reports.filter(r => r.status === 'Terminé').length;
    const pendingReports = reports.filter(r => r.status !== 'Terminé').length;
    const upcomingDeployments = deployments.filter(d => {
      const now = new Date();
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);
      return d.date >= now && d.date <= oneWeekLater;
    }).length;
    const cleanedBlocks = sanitaryBlocks.filter(b => b.status === 'Nettoyé').length;
    const sanitaryBlocksConformity = sanitaryBlocks.length > 0 
      ? Math.round((cleanedBlocks / sanitaryBlocks.length) * 100) 
      : 0;
    
    return {
      completedReports,
      pendingReports,
      totalReports: reports.length,
      upcomingDeployments,
      cleanedBlocks,
      sanitaryBlocksConformity
    };
  };

  const value = {
    reports,
    deployments,
    sanitaryBlocks,
    loading,
    error,
    setDeployments,
    setError,
    refreshData,
    getStats  // Assurez-vous que getStats est bien incluse ici
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
