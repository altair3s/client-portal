import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import MapWrapper from './MapWrapper';

// Fonction pour convertir les dates françaises (DD/MM/YYYY) en format Date
const parseDate = (dateStr) => {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
};

// Fonction pour convertir des dates JS en format français pour l'affichage
const formatDateForInput = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

// Fonction pour calculer la durée entre deux heures au format "HH:MM:SS" ou "H:MM:SS"
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  
  // Convertir les heures en minutes
  const parseTime = (timeStr) => {
    const [hours, minutes, seconds = '0'] = timeStr.split(':').map(Number);
    return hours * 60 + minutes + (Number(seconds) / 60);
  };
  
  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  
  // Gérer le cas où la fin est le lendemain
  let durationMinutes = endMinutes - startMinutes;
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60; // Ajouter 24 heures
  }
  
  return durationMinutes;
};

// Fonction pour formater la durée en minutes vers "HH:MM"
const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Configuration pour l'accès à Google Sheets
const SHEET_ID_BS = process.env.REACT_APP_REPORTS_SHEET_ID_BS;
const API_KEY = process.env.REACT_APP_API_KEY;
const RANGE = 'Data!A1:K';

const BS = () => {
  const [allPrestations, setAllPrestations] = useState([]);
  const [filteredPrestations, setFilteredPrestations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [mapCenter, setMapCenter] = useState([48.8566, 2.3522]); // Paris par défaut
  const [mapZoom, setMapZoom] = useState(13);
  
  // Ajout des états pour l'analyse BS
  const [bsData, setBsData] = useState([]);
  const [bsList, setBsList] = useState([]);
  const [selectedBS, setSelectedBS] = useState("");
  const [bsStats, setBsStats] = useState({});
  const [totalDuration, setTotalDuration] = useState("00:00");
  const [showBSAnalysis, setShowBSAnalysis] = useState(false);

  // Fonction pour charger les données BS depuis Google Sheets
  const fetchBSData = async () => {
    try {
      const bsSheetId = SHEET_ID_BS; // Utiliser le même Sheet ID ou le remplacer par celui spécifique aux BS
      const bsRange = 'Data!A:P'; // Ajuster selon la structure de vos données
      
      const bsApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${bsSheetId}/values/${bsRange}?key=${API_KEY}`;
      
      const response = await fetch(bsApiUrl);
      
      if (!response.ok) {
        throw new Error(`Erreur lors de la récupération des données BS: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.values || result.values.length === 0) {
        throw new Error('Aucune donnée BS trouvée dans la feuille');
      }
      
      // Extraire les en-têtes
      const headers = result.values[0];
      
      // Trouver les indices des colonnes nécessaires pour l'analyse BS
      const bsIndex = headers.findIndex(header => header === 'BS');
      const dateIndex = headers.findIndex(header => header === 'Date');
      const heureDebutIndex = headers.findIndex(header => header === 'Heure début');
      const heureFinIndex = headers.findIndex(header => header === 'Heure fin');
      
      // Transformer les données
      const formattedBSData = result.values.slice(1).map(row => {
        return {
          BS: bsIndex !== -1 && row[bsIndex] ? row[bsIndex] : '',
          Date: dateIndex !== -1 && row[dateIndex] ? row[dateIndex] : '',
          "Heure début": heureDebutIndex !== -1 && row[heureDebutIndex] ? row[heureDebutIndex] : '',
          "Heure fin": heureFinIndex !== -1 && row[heureFinIndex] ? row[heureFinIndex] : '',
        };
      }).filter(item => item.BS && item["Heure début"] && item["Heure fin"]);
      
      setBsData(formattedBSData);
      
      // Extraire la liste des BS uniques
      const uniqueBS = [...new Set(formattedBSData.filter(row => row.BS).map(row => row.BS))];
      setBsList(uniqueBS);
      
      if (uniqueBS.length > 0) {
        setSelectedBS(uniqueBS[0]);
      }
      
      // Analyser les données BS selon la période sélectionnée
      analyzeBS(formattedBSData, dateDebut, dateFin);
      
      console.log("Données BS chargées:", formattedBSData.length, "entrées");
      
    } catch (err) {
      console.error('Erreur lors du chargement des données BS:', err);
      // Ne pas définir d'erreur globale pour ne pas perturber l'affichage de la carte
    }
  };

  // Fonction pour analyser les données BS selon la période sélectionnée
  const analyzeBS = (bsDataToAnalyze, start, end) => {
    // Convertir les dates de string (YYYY-MM-DD) en objets Date pour la comparaison
    let startDate = null;
    let endDate = null;
    
    if (start) {
      startDate = new Date(start);
      startDate.setHours(0, 0, 0, 0);
    }
    
    if (end) {
      endDate = new Date(end);
      endDate.setHours(23, 59, 59, 999);
    }
    
    // Filtrer selon les dates spécifiées
    const filteredBS = bsDataToAnalyze.filter(item => {
      if (!item.Date) return false;
      
      // Convertir la date du format français ou autre en objet Date
      let itemDate = null;
      try {
        if (item.Date.includes('/')) {
          const parts = item.Date.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10);
            const year = parts[2].length === 2 ? 2000 + parseInt(parts[2], 10) : parseInt(parts[2], 10);
            itemDate = new Date(year, month - 1, day);
          } else {
            return false;
          }
        } else if (item.Date.includes('/') && item.Date.length <= 8) {
          const [month, day, year] = item.Date.split('/').map(Number);
          const fullYear = year < 100 ? 2000 + year : year;
          itemDate = new Date(fullYear, month - 1, day);
        } else {
          return false;
        }
      } catch (e) {
        console.error(`Erreur de conversion de date pour: ${item.Date}`, e);
        return false;
      }
      
      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate >= startDate;
      } else if (endDate) {
        return itemDate <= endDate;
      }
      
      return true;
    });
    
    // Calculer les durées pour chaque entrée
    const entriesWithDuration = filteredBS.map(entry => {
      const duration = calculateDuration(entry["Heure début"], entry["Heure fin"]);
      return {
        ...entry,
        duration // Durée en minutes
      };
    });
    
    // Statistiques par BS
    const statsBS = {};
    entriesWithDuration.forEach(entry => {
      const bs = entry.BS;
      if (!bs) return;
      
      if (!statsBS[bs]) {
        statsBS[bs] = {
          count: 0,
          totalDuration: 0,
          lastVisit: null,
          visits: []
        };
      }
      
      statsBS[bs].count += 1;
      statsBS[bs].totalDuration += entry.duration;
      
      const visitDate = entry.Date;
      if (!statsBS[bs].lastVisit || new Date(visitDate) > new Date(statsBS[bs].lastVisit)) {
        statsBS[bs].lastVisit = visitDate;
      }
      
      statsBS[bs].visits.push({
        date: entry.Date,
        start: entry["Heure début"],
        end: entry["Heure fin"],
        duration: entry.duration
      });
    });
    
    // Calculer les moyennes
    Object.keys(statsBS).forEach(bs => {
      statsBS[bs].averageDuration = statsBS[bs].totalDuration / statsBS[bs].count;
      // Formater les durées
      statsBS[bs].formattedTotal = formatDuration(statsBS[bs].totalDuration);
      statsBS[bs].formattedAverage = formatDuration(statsBS[bs].averageDuration);
    });
    
    // Durée totale sur toutes les visites
    const totalDurationMinutes = entriesWithDuration.reduce((sum, entry) => sum + entry.duration, 0);
    
    setBsStats(statsBS);
    setTotalDuration(formatDuration(totalDurationMinutes));
  };

  useEffect(() => {
    const delay = (ms) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    };

    const fetchGoogleSheetsData = async () => {
      try {
        setIsLoading(true);
        
        await delay(100);
        
        const sheetsApiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID_BS}/values/${RANGE}?key=${API_KEY}`;
        
        console.log('Récupération des données de Google Sheets:', sheetsApiUrl);
        const response = await fetch(sheetsApiUrl);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.values || result.values.length === 0) {
          throw new Error('Aucune donnée trouvée dans la feuille');
        }
        
        const headers = result.values[0];
        
        const bsIndex = headers.findIndex(header => header === 'BS');
        const dateIndex = headers.findIndex(header => header === 'Date');
        const zoneIndex = headers.findIndex(header => header === 'Zone');
        const categorieIndex = headers.findIndex(header => header === 'Catégorie');
        const posIndex = headers.findIndex(header => header === 'Pos');
        const heureDebutIndex = headers.findIndex(header => header === 'Heure début');
        const heureFinIndex = headers.findIndex(header => header === 'Heure fin');
        
        const formattedData = result.values.slice(1).map((row, index) => {
          let position = [0, 0];
          
          if (posIndex !== -1 && row[posIndex]) {
            const coordinates = row[posIndex].split(',').map(coord => parseFloat(coord.trim()));
            if (coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1])) {
              position = coordinates;
            }
          }
          
          const rawDate = dateIndex !== -1 && row[dateIndex] ? row[dateIndex] : '';
          
          let duration = null;
          let formattedDuration = '';
          if (heureDebutIndex !== -1 && heureFinIndex !== -1 && row[heureDebutIndex] && row[heureFinIndex]) {
            const durationMinutes = calculateDuration(row[heureDebutIndex], row[heureFinIndex]);
            duration = durationMinutes;
            formattedDuration = formatDuration(durationMinutes);
          }
          
          return {
            id: bsIndex !== -1 && row[bsIndex] ? row[bsIndex] : `prestation-${index}`,
            date: rawDate,
            dateObj: parseDate(rawDate),
            zone: zoneIndex !== -1 && row[zoneIndex] ? row[zoneIndex] : '',
            categorie: categorieIndex !== -1 && row[categorieIndex] ? row[categorieIndex] : '',
            position: position,
            heureDebut: heureDebutIndex !== -1 ? row[heureDebutIndex] : '',
            heureFin: heureFinIndex !== -1 ? row[heureFinIndex] : '',
            duration: duration,
            formattedDuration: formattedDuration
          };
        });
        
        const validData = formattedData.filter(item => 
          (item.position[0] !== 0 || item.position[1] !== 0) && item.dateObj !== null
        );
        
        if (validData.length === 0) {
          throw new Error('Aucune coordonnée valide trouvée dans les données');
        }
        
        const dates = validData.map(item => item.dateObj).filter(Boolean).sort((a, b) => a.getTime() - b.getTime());
        const maxDate = dates[dates.length - 1] || new Date();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
              
        setAllPrestations(validData);
        
        setDateDebut(formatDateForInput(today));
        setDateFin(formatDateForInput(today));
        
        console.log("Données chargées:", validData.length, "prestations");
        
        fetchBSData();
      } catch (err) {
        console.error('Erreur:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoogleSheetsData();
  }, []);

  useEffect(() => {
    if (!allPrestations.length) return;
    
    console.log("Filtrage avec plage de dates:", dateDebut, "à", dateFin);
    console.log("Total des prestations avant filtrage:", allPrestations.length);
    
    let startDate = 'today';
    let endDate = 'today';
    
    if (dateDebut) {
      startDate = new Date(dateDebut);
      startDate.setHours(0, 0, 0, 0);
    }
    
    if (dateFin) {
      endDate = new Date(dateFin);
      endDate.setHours(23, 59, 59, 999);
    }
    
    if (startDate === 'today' && endDate === 'today') {
      setFilteredPrestations(allPrestations);
      console.log("Aucune plage de dates, affichage de toutes les prestations:", allPrestations.length);
      return;
    }
    
    const filtered = allPrestations.filter(item => {
      if (!item.dateObj) return false;
      
      const itemDate = new Date(item.dateObj.getTime());
      itemDate.setHours(0, 0, 0, 0);
      
      if (startDate !== 'today' && endDate !== 'today') {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate !== 'today') {
        return itemDate >= startDate;
      } else if (endDate !== 'today') {
        return itemDate <= endDate;
      }
      
      return true;
    });
    
    console.log("Prestations filtrées:", filtered.length);
    setFilteredPrestations(filtered);
    
    if (filtered.length > 0) {
      const newCenter = [
        filtered.reduce((sum, item) => sum + item.position[0], 0) / filtered.length,
        filtered.reduce((sum, item) => sum + item.position[1], 0) / filtered.length
      ];
      setMapCenter(newCenter);
      
      if (filtered.length <= 10) {
        setMapZoom(14);
      } else if (filtered.length <= 50) {
        setMapZoom(13);
      } else {
        setMapZoom(12);
      }
    }
    
    if (bsData.length > 0) {
      analyzeBS(bsData, dateDebut, dateFin);
    }
  }, [dateDebut, dateFin, allPrestations, bsData]);

  const selectedBSStats = bsStats[selectedBS] || {
    count: 0,
    lastVisit: "-",
    formattedTotal: "00:00",
    formattedAverage: "00:00",
    visits: []
  };

  const styles = {
    container: {
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
      letterSpacing: '-0.025em'
    },
    subtitle: {
      color: '#64748b',
      fontSize: '16px',
      marginBottom: '24px'
    },
    filterCard: {
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    filterRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      flexWrap: 'wrap'
    },
    filterLabel: {
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    dateLabel: {
      fontWeight: '500',
      color: '#64748b',
      fontSize: '14px'
    },
    dateInput: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      width: '160px',
      outline: 'none',
      transition: 'border-color 0.2s ease'
    },
    button: {
      padding: '8px 20px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      border: 'none',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 1px 3px rgba(59, 130, 246, 0.3)'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#64748b',
      border: '1px solid #e2e8f0'
    },
    mapCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    mapHeader: {
      padding: '24px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    mapTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    mapStats: {
      display: 'flex',
      gap: '16px',
      marginTop: '12px'
    },
    statBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: '#eff6ff',
      color: '#1d4ed8',
      padding: '6px 12px',
      borderRadius: '16px',
      fontSize: '12px',
      fontWeight: '600'
    },
    mapContainer: {
      height: '500px',
      position: 'relative'
    },
    analysisCard: {
      backgroundColor: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    analysisHeader: {
      padding: '24px',
      borderBottom: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc'
    },
    analysisTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    totalDurationCard: {
      backgroundColor: '#eff6ff',
      padding: '16px',
      borderRadius: '12px',
      marginBottom: '16px'
    },
    totalDurationLabel: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#1d4ed8',
      marginBottom: '4px'
    },
    totalDurationValue: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#1e293b'
    },
    select: {
      padding: '8px 12px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '14px',
      width: '100%',
      outline: 'none',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    selectLabel: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#374151',
      fontSize: '14px'
    },
    analysisContent: {
      padding: '24px'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    statCard: {
      padding: '16px',
      backgroundColor: '#f8fafc',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    statLabel: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#64748b',
      marginBottom: '4px',
      textTransform: 'uppercase',
      letterSpacing: '0.025em'
    },
    statValue: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#1e293b'
    },
    chartCard: {
      backgroundColor: '#f8fafc',
      padding: '24px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0'
    },
    chartTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '16px'
    },
    spinner: {
      width: '48px',
      height: '48px',
      border: '4px solid #f1f5f9',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    noDataCard: {
      padding: '48px',
      textAlign: 'center',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      backgroundColor: 'white'
    },
    errorCard: {
      padding: '24px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '12px'
    }
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <div style={styles.spinner}></div>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <p style={{ color: '#ef4444', fontWeight: '500', margin: 0 }}>
            Erreur: {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Suivi des blocs sanitaires</h1>
        <p style={styles.subtitle}>
          {filteredPrestations.length} prestation{filteredPrestations.length > 1 ? 's' : ''} sur {allPrestations.length}
        </p>

        {/* Filtres de dates */}
        <div style={styles.filterCard}>
          <div style={styles.filterRow}>
            <div style={styles.filterLabel}>
              Filtrer par période
            </div>
            <span style={styles.dateLabel}>Du</span>
            <input
              type="date"
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              style={styles.dateInput}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <span style={styles.dateLabel}>au</span>
            <input
              type="date"
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              style={styles.dateInput}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            {(dateDebut || dateFin) && (
              <button
                onClick={() => {
                  setDateDebut('');
                  setDateFin('');
                  setFilteredPrestations(allPrestations);
                }}
                style={{...styles.button, ...styles.secondaryButton}}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Carte */}
      <div style={styles.mapCard}>
        <div style={styles.mapHeader}>
          <h2 style={styles.mapTitle}>
            🗺️ Localisation des prestations
          </h2>
          <div style={styles.mapStats}>
            <div style={styles.statBadge}>
              📍 {filteredPrestations.length} point{filteredPrestations.length > 1 ? 's' : ''}
            </div>
            {filteredPrestations.length > 0 && (
              <div style={styles.statBadge}>
                🕒 {filteredPrestations.filter(p => p.formattedDuration).length} avec durée
              </div>
            )}
          </div>
        </div>
        
        <div style={styles.mapContainer}>
          <MapWrapper 
            prestations={filteredPrestations} 
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>

      {/* Bouton d'analyse BS */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <button 
          onClick={() => setShowBSAnalysis(!showBSAnalysis)} 
          style={{...styles.button, ...styles.primaryButton}}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          {showBSAnalysis ? "🔽 Masquer l'analyse BS" : "🔼 Afficher l'analyse BS"}
        </button>
      </div>
      
      {/* Section d'analyse BS */}
      {showBSAnalysis && (
        <div style={styles.analysisCard}>
          <div style={styles.analysisHeader}>
            <h2 style={styles.analysisTitle}>
              Analyse des blocs sanitaires
            </h2>
            
            <div style={styles.totalDurationCard}>
              <div style={styles.totalDurationLabel}>Durée totale sur la période</div>
              <div style={styles.totalDurationValue}>{totalDuration}</div>
            </div>
            
            <div>
              <label style={styles.selectLabel}>
                Sélectionner un bloc sanitaire
              </label>
              <select
                value={selectedBS}
                onChange={(e) => setSelectedBS(e.target.value)}
                style={styles.select}
                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              >
                {bsList.map((bs) => (
                  <option key={bs} value={bs}>
                    {bs}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {selectedBS && (
            <div style={styles.analysisContent}>
              <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>
                Statistiques pour {selectedBS}
              </h3>
              
              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Nombre de visites</div>
                  <div style={styles.statValue}>{selectedBSStats.count}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Dernière visite</div>
                  <div style={styles.statValue}>{selectedBSStats.lastVisit}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Durée totale</div>
                  <div style={styles.statValue}>{selectedBSStats.formattedTotal}</div>
                </div>
                <div style={styles.statCard}>
                  <div style={styles.statLabel}>Durée moyenne</div>
                  <div style={styles.statValue}>{selectedBSStats.formattedAverage}</div>
                </div>
              </div>
              
              {selectedBSStats.visits && selectedBSStats.visits.length > 0 && (
                <div style={styles.chartCard}>
                  <h4 style={styles.chartTitle}>📊 Durées des visites (minutes)</h4>
                  <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={selectedBSStats.visits.map((visit, index) => ({
                          id: index + 1,
                          date: visit.date,
                          durée: Math.round(visit.duration)
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="id" />
                        <YAxis />
                        <Tooltip formatter={(value) => [value, 'Minutes']} />
                        <Legend />
                        <Bar dataKey="durée" fill="#3b82f6" name="Durée (minutes)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {filteredPrestations.length === 0 && (
        <div style={styles.noDataCard}>
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
            Aucune prestation trouvée pour la période sélectionnée
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default BS;