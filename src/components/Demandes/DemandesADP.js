import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaChartLine, 
  FaBell,
  FaSearch,
  FaDownload,
  FaPlus,
  FaEye,
  FaEdit,
  FaTrash,
  FaRedo,
  FaRegCheckCircle,
  FaRegClock,
  FaChevronLeft,
  FaChevronRight,
  FaBuilding,
  FaMapMarkerAlt
} from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement 
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Avatar,
  Tooltip as MuiTooltip,
  Fab,
  Badge
} from '@mui/material';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DemandesADP = () => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tous');
  const [priorityFilter, setPriorityFilter] = useState('Toutes');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newDemandesCount, setNewDemandesCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState(new Date());
  const [stats, setStats] = useState({
    total: 0,
    enAttente: 0,
    enCours: 0,
    terminees: 0,
    realisees: 0,
    byZone: {},
    byTypePrestation: {},
    byDemandeur: {}
  });

  // Configuration Google Sheets
  const SPREADSHEET_ID = process.env.REACT_APP_REPORTS_SHEET_ID_CR;
  const SHEET_NAME = 'Sequoia';
  const RANGE = 'A1:S';
  const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

  // Fonction pour parser les dates
  const parseDate = (dateString) => {
    if (!dateString) return null;
    // Format attendu: DD/MM/YYYY ou DD/MM/YYYY HH:MM:SS
    const [datePart] = dateString.split(' ');
    const [day, month, year] = datePart.split('/');
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

  // Fonction pour compter les nouvelles demandes
  const countNewDemandes = (allDemandes) => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    
    const newDemandes = allDemandes.filter(demande => {
      const creationDate = parseDate(demande.dateCreation);
      return creationDate && creationDate > twentyFourHoursAgo;
    });
    
    return newDemandes.length;
  };

  // Fonction pour récupérer les données depuis Google Sheets
  const fetchDemandesData = async (silent = false) => {
    if (!SPREADSHEET_ID || !API_KEY) {
      setError('Configuration manquante: SPREADSHEET_ID ou API_KEY non défini');
      setLoading(false);
      return;
    }

    try {
      if (!silent) setLoading(true);
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!${RANGE}?key=${API_KEY}`;
      const response = await axios.get(url);
      
      const data = response.data.values || [];
      if (data.length === 0) {
        setError('Aucune donnée trouvée dans la feuille');
        setLoading(false);
        return;
      }

      const headers = data[0];
      const rows = data.slice(1);
      
      // Mapper les données selon les en-têtes de votre Google Sheet
      const parsedData = rows.map((row, index) => {
        const obj = {};
        headers.forEach((header, headerIndex) => {
          obj[header] = row[headerIndex] || '';
        });
        
        // Ajouter des propriétés calculées pour compatibilité
        return {
          ...obj,
          // Propriétés originales Google Sheet
          id: obj['ID'] || `ADP${String(index + 1).padStart(3, '0')}`,
          titre: obj['Type de Prestation'] || 'Non spécifié',
          description: obj['Détail prestation'] || 'Aucune description',
          zone: obj['Zone'] || 'Non spécifiée',
          batiment: obj['Bâtiment'] || 'Non spécifié',
          niveau: obj['Niveau'] || 'Non spécifié',
          demandeur: obj['Demandeur'] || 'Non spécifié',
          dateCreation: obj['Date'] || '',
          dateEcheance: obj['Date prévue de réalisation'] || '',
          dateReelle: obj['Date effective de réalisation'] || '',
          statut: obj['Statut Prestation'] || 'Non défini',
          typePrestation: obj['Type de Prestation'] || 'Non spécifié',
          carroyage: obj['Carroyage'] || '',
          ascenseurs: obj['Ascenseurs / Escaliers mécaniques'] || '',
          numeroBatiment: obj['N° bâtiment'] || '',
          zoneSurete: obj['Zone de sûreté'] || '',
          photo1: obj['Photo 1'] || '',
          photo2: obj['Photo 2'] || '',
          horodatage: obj['HorodLastChg'] || '',
          
          // Propriétés calculées pour les graphiques
          departement: obj['Zone'] || 'Non spécifiée', // Utiliser Zone comme département
          priorite: obj['Zone de sûreté'] || 'Normale', // Utiliser Zone de sûreté comme priorité
          progression: obj['Statut Prestation'] === 'Réalisée' ? 100 : 
                      obj['Statut Prestation'] === 'En cours' ? 50 : 25,
          avatar: obj['Demandeur'] ? obj['Demandeur'].split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) : 'NN'
        };
      });

      // Trier par date de création (plus récent en premier)
      const sortedData = parsedData.sort((a, b) => {
        const dateA = parseDate(a.dateCreation);
        const dateB = parseDate(b.dateCreation);
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB - dateA;
      });

      // Compter les nouvelles demandes
      const newCount = countNewDemandes(sortedData);
      setNewDemandesCount(newCount);

      setDemandes(sortedData);
      setFilteredDemandes(sortedData);
      calculateStats(sortedData);
      generateCalendarEvents(sortedData);
      setError('');
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      setError('Erreur lors du chargement des données: ' + error.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Fonction pour marquer les notifications comme lues
  const markNotificationsAsRead = () => {
    setNewDemandesCount(0);
    setLastCheckTime(new Date());
  };

  useEffect(() => {
    fetchDemandesData();
    // Actualiser les données toutes les 5 minutes
    const interval = setInterval(() => fetchDemandesData(true), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterDemandes();
  }, [searchTerm, statusFilter, priorityFilter, demandes]);

  const calculateStats = (data) => {
    const newStats = {
      total: data.length,
      enAttente: data.filter(d => d.statut === 'En attente').length,
      enCours: data.filter(d => d.statut === 'En cours').length,
      realisees: data.filter(d => d.statut === 'Réalisée').length,
      byZone: {},
      byTypePrestation: {},
      byDemandeur: {}
    };

    data.forEach(demande => {
      // Stats par zone
      const zone = demande.zone || 'Non spécifiée';
      newStats.byZone[zone] = (newStats.byZone[zone] || 0) + 1;
      
      // Stats par type de prestation
      const type = demande.typePrestation || 'Non spécifié';
      newStats.byTypePrestation[type] = (newStats.byTypePrestation[type] || 0) + 1;
      
      // Stats par demandeur
      const demandeur = demande.demandeur || 'Non spécifié';
      newStats.byDemandeur[demandeur] = (newStats.byDemandeur[demandeur] || 0) + 1;
    });

    setStats(newStats);
  };

  const generateCalendarEvents = (data) => {
    const events = [];
    
    data.forEach(demande => {
      // Ajouter les dates d'échéance
      const dateEcheance = parseDate(demande.dateEcheance);
      if (dateEcheance) {
        events.push({
          id: demande.id,
          title: demande.titre || demande.typePrestation,
          date: dateEcheance,
          type: 'echeance',
          statut: demande.statut,
          priorite: demande.priorite,
          demandeur: demande.demandeur,
          zone: demande.zone
        });
      }
      
      // Ajouter les dates de réalisation effective si disponibles
      const dateReelle = parseDate(demande.dateReelle);
      if (dateReelle) {
        events.push({
          id: `${demande.id}_real`,
          title: `✅ ${demande.titre || demande.typePrestation}`,
          date: dateReelle,
          type: 'realisation',
          statut: 'Réalisée',
          priorite: demande.priorite,
          demandeur: demande.demandeur,
          zone: demande.zone
        });
      }
    });
    
    setCalendarEvents(events);
  };

  const filterDemandes = () => {
    let filtered = demandes.filter(demande => {
      const matchesSearch = demande.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           demande.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           demande.demandeur.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Tous' || demande.statut === statusFilter;
      const matchesPriority = priorityFilter === 'Toutes' || demande.zone === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredDemandes(filtered);
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'En attente': return 'bg-yellow-100 text-yellow-800';
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Réalisée': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priorite) => {
    switch (priorite) {
      case 'Haute': 
      case 'URGENT': 
      case 'Critique': return 'bg-red-100 text-red-800';
      case 'Moyenne': 
      case 'Normale': return 'bg-orange-100 text-orange-800';
      case 'Basse': 
      case 'Faible': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRowBackgroundColor = (statut) => {
    switch (statut) {
      case 'En attente': 
        return 'bg-blue-50 border-l-4 border-blue-400 hover:bg-blue-100';
      case 'En cours': 
        return 'bg-orange-100 border-l-4 border-orange-400 hover:bg-orange-100';
      case 'Réalisée': 
        return 'bg-green-50 border-l-4 border-green-400 hover:bg-green-100';
      default: 
        return 'bg-white border-l-4 border-gray-200 hover:bg-gray-50';
    }
  };

  const getRowStyle = (statut) => {
    const baseStyle = {
      transition: 'all 0.2s',
      borderLeft: '4px solid'
    };

    switch (statut) {
      case 'En attente':
        return {
          ...baseStyle,
          backgroundColor: '#fefce8',
          borderLeftColor: '#facc15'
        };
      case 'En cours':
        return {
          ...baseStyle,
          backgroundColor: '#7da9e2ff',
          borderLeftColor: '#0a72e9ff'
        };
      
      case 'Réalisée':
        return {
          ...baseStyle,
          backgroundColor: '#ecfdf5',
          borderLeftColor: '#10b981'
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: '#ffffff',
          borderLeftColor: '#e5e7eb'
        };
    }
  };

  const handleViewDetails = (demande) => {
    setSelectedDemande(demande);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDemande(null);
  };

  // Fonctions pour le calendrier
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const getNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getEventsForDate = (date) => {
    return calendarEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthNames = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    const days = [];
    
    // Jours vides au début
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const events = getEventsForDate(date);
      const isCurrentDay = isToday(date);
      
      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          className={`h-24 border border-gray-200 p-1 cursor-pointer transition-all duration-200 ${
            isCurrentDay ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
          } ${selectedDate && selectedDate.toDateString() === date.toDateString() ? 'bg-blue-100' : ''}`}
          onClick={() => setSelectedDate(date)}
        >
          <div className={`text-sm font-medium mb-1 ${isCurrentDay ? 'text-blue-600' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="space-y-1">
            {events.slice(0, 2).map((event, index) => (
              <div
                key={index}
                className={`text-xs p-1 rounded truncate ${
                  event.statut === 'Réalisée' ? 'bg-green-100 text-green-800' :
                  event.statut === 'En cours' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}
                title={event.title}
              >
                {event.title.length > 15 ? event.title.substring(0, 15) + '...' : event.title}
              </div>
            ))}
            {events.length > 2 && (
              <div className="text-xs text-gray-500 font-medium">
                +{events.length - 2} autre{events.length - 2 > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </motion.div>
      );
    }
    
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* En-tête du calendrier */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={getPreviousMonth}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <FaChevronLeft />
            </button>
            <h2 className="text-xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={getNextMonth}
              className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
            >
              <FaChevronRight />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map(dayName => (
              <div key={dayName} className="text-center text-sm font-medium py-2">
                {dayName}
              </div>
            ))}
          </div>
        </div>
        
        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-0">
          {days}
        </div>
      </div>
    );
  };

  // Données pour les graphiques
  const zoneChartData = {
    labels: Object.keys(stats.byZone),
    datasets: [{
      label: 'Demandes par zone',
      data: Object.values(stats.byZone),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const typePrestationChartData = {
    labels: Object.keys(stats.byTypePrestation),
    datasets: [{
      data: Object.values(stats.byTypePrestation),
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const statutChartData = {
    labels: ['En attente', 'En cours', 'Réalisée'],
    datasets: [{
      data: [stats.enAttente, stats.enCours, stats.terminees, stats.realisees],
      backgroundColor: ['#F59E0B', '#3B82F6', '#10B981', '#059669'],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const demandeurChartData = {
    labels: Object.keys(stats.byDemandeur).slice(0, 10), // Top 10 demandeurs
    datasets: [{
      label: 'Demandes par demandeur',
      data: Object.values(stats.byDemandeur).slice(0, 10),
      backgroundColor: '#3B82F6',
      borderWidth: 1,
      borderColor: '#2563EB'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== undefined) {
              label += context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(2) : 0;
              label += ` (${percentage}%)`;
            }
            return label;
          }
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      x: {
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 45
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 10
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      {/* Indicateur de chargement */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="text-gray-700">Chargement des données...</span>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
        >
          <div className="flex items-center">
            <strong className="font-bold mr-2">Erreur:</strong>
            <span>{error}</span>
          </div>
        </motion.div>
      )}

      {/* Header avec navigation par onglets */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg relative">
              <Badge 
                badgeContent={newDemandesCount} 
                color="error"
                className="cursor-pointer"
                onClick={markNotificationsAsRead}
                invisible={newDemandesCount === 0}
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#ef4444',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '10px',
                    top: '8px',
                    right: '8px',
                    animation: newDemandesCount > 0 ? 'pulse 2s infinite' : 'none',
                  }
                }}
              >
                <FaBell className="text-white text-2xl" />
              </Badge>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Demandes Prestations</h1>
              <p className="text-gray-600">
                Suivi des demandes de prestations - Sequoia
                {newDemandesCount > 0 && (
                  <span className="ml-2 text-red-600 font-medium">
                    ({newDemandesCount} nouvelle{newDemandesCount > 1 ? 's' : ''} demande{newDemandesCount > 1 ? 's' : ''})
                  </span>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outlined"
              onClick={() => fetchDemandesData()}
              disabled={loading}
              className="border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              Actualiser
            </Button>
            <Fab 
              color="primary" 
              aria-label="add"
              className="bg-gradient-to-r from-blue-500 to-purple-600"
            >
              <FaPlus />
            </Fab>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 shadow-lg mb-6">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
            { id: 'calendar', label: 'Calendrier', icon: FaCalendarAlt },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="text-sm" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'dashboard' && !loading && (
        <>
          {/* Cards de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { title: 'Total', value: stats.total, icon: FaUsers, color: 'blue' },
              { title: 'En attente', value: stats.enAttente, icon: FaRegClock, color: 'yellow' },
              { title: 'En cours', value: stats.enCours, icon: FaRedo, color: 'blue' },
              { title: 'Réalisées', value: stats.realisees, icon: FaRegCheckCircle, color: 'green' }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.4 }}
                className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                    <stat.icon className={`text-${stat.color}-600 text-xl`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Graphiques - Tous sur une ligne */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-2 gap-4 mb-8"
          >
            {/* Graphique 1 - Zones */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-md font-semibold mb-3 text-gray-800">Demandes par zone</h3>
              <div style={{ height: '200px' }}>
                <Bar data={zoneChartData} options={barChartOptions} />
              </div>
            </div>
            
            {/* Graphique 2 - Types de prestation */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-md font-semibold mb-3 text-gray-800">Types de prestation</h3>
              <div style={{ height: '200px' }}>
                <Doughnut data={typePrestationChartData} options={chartOptions} />
              </div>
            </div>
            
            {/* Graphique 3 - Statuts */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-md font-semibold mb-3 text-gray-800">Répartition par statut</h3>
              <div style={{ height: '200px' }}>
                <Doughnut data={statutChartData} options={chartOptions} />
              </div>
            </div>
            
            {/* Graphique 4 - Demandeurs */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-md font-semibold mb-3 text-gray-800">Top 10 demandeurs</h3>
              <div style={{ height: '200px' }}>
                <Bar data={demandeurChartData} options={barChartOptions} />
              </div>
            </div>
          </motion.div>

          {/* Filtres et recherche */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Tous">Tous les statuts</option>
                <option value="En attente">En attente</option>
                <option value="En cours">En cours</option>
                <option value="Réalisée">Réalisées</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Toutes">Toutes zones</option>
                {Object.keys(stats.byZone).map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
                ))}
              </select>
              
              <Button
                variant="outlined"
                startIcon={<FaDownload />}
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Exporter
              </Button>
            </div>
          </motion.div>

          {/* Liste des demandes */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">
                Demandes ({filteredDemandes.length})
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demandeur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Zone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progression
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Échéance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredDemandes.map((demande, index) => {
                    const rowBgClass = getRowBackgroundColor(demande.statut);
                    return (
                      <motion.tr 
                        key={demande.id}
                        className={`transition-all duration-200 ${rowBgClass}`}
                      >
                        <td className="w-1/6 px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{demande.id}</div>
                            <div className="text-sm text-blue-600 font-medium truncate">{demande.typePrestation}</div>
                            <div className="text-sm text-gray-500 truncate">{demande.description}</div>
                          </div>
                        </td>
                        <td className="w-1/6 px-6 py-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-3 bg-blue-500 text-white text-xs flex-shrink-0">
                              {demande.avatar}
                            </Avatar>
                            <span className="text-sm text-gray-900 truncate">{demande.demandeur}</span>
                          </div>
                        </td>
                        <td className="w-1/6 px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900 flex items-center">
                              <FaMapMarkerAlt className="mr-1 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{demande.zone}</span>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <FaBuilding className="mr-1 text-gray-400 flex-shrink-0" />
                              <span className="truncate">{demande.batiment} - {demande.niveau}</span>
                            </div>
                          </div>
                        </td>
                        <td className="w-1/12 px-6 py-4">
                          <Chip 
                            label={demande.zoneSurete || 'Standard'} 
                            size="small"
                            className={getPriorityColor(demande.zoneSurete)}
                          />
                        </td>
                        <td className="w-1/12 px-6 py-4">
                          <Chip 
                            label={demande.statut} 
                            size="small"
                            className={getStatusColor(demande.statut)}
                          />
                        </td>
                        <td className="w-1/8 px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${demande.progression}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 whitespace-nowrap">{demande.progression}%</span>
                          </div>
                        </td>
                        <td className="w-1/8 px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900">
                              {demande.dateEcheance ? parseDate(demande.dateEcheance)?.toLocaleDateString('fr-FR') : 'Non définie'}
                            </div>
                            {demande.dateReelle && (
                              <div className="text-xs text-green-600">
                                ✅ {parseDate(demande.dateReelle)?.toLocaleDateString('fr-FR')}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="w-1/8 px-6 py-4">
                          <div className="flex space-x-1">
                            <MuiTooltip title="Voir détails">
                              <Button
                                size="small"
                                onClick={() => handleViewDetails(demande)}
                                className="text-blue-600 hover:bg-blue-50 min-w-0 p-1"
                              >
                                <FaEye className="text-xl" />
                              </Button>
                            </MuiTooltip>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        </>
      )}

      {/* Vue Calendrier */}
      {activeTab === 'calendar' && !loading && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6"
        >
          <div className="xl:col-span-2">
            {renderCalendar()}
          </div>
          <div className="xl:col-span-1">
            {selectedDate ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Événements du {selectedDate.toLocaleDateString('fr-FR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h3>
                
                {(() => {
                  const events = getEventsForDate(selectedDate);
                  if (events.length === 0) {
                    return <p className="text-gray-500 italic">Aucun événement prévu</p>;
                  }
                  return (
                    <div className="space-y-3">
                      {events.map((event, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{event.title}</h4>
                            <Chip 
                              label={event.statut} 
                              size="small"
                              className={getStatusColor(event.statut)}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            <strong>Demandeur:</strong> {event.demandeur}
                          </p>
                          <div className="flex justify-between items-center">
                            <Chip 
                              label={event.zone || 'Zone non définie'} 
                              size="small"
                              className="bg-blue-100 text-blue-800"
                            />
                            <span className="text-xs text-gray-500">
                              ID: {event.id}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  );
                })()}
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
                <FaCalendarAlt className="mx-auto text-4xl mb-4 text-gray-300" />
                <p>Cliquez sur une date pour voir les événements</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Modal de détails */}
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          Détails de la demande - {selectedDemande?.id}
        </DialogTitle>
        <DialogContent className="mt-4">
          {selectedDemande && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>ID :</strong> {selectedDemande.id}
                </div>
                <div>
                  <strong>Type :</strong> {selectedDemande.typePrestation}
                </div>
                <div>
                  <strong>Demandeur :</strong> {selectedDemande.demandeur}
                </div>
                <div>
                  <strong>Zone :</strong> {selectedDemande.zone}
                </div>
                <div>
                  <strong>Bâtiment :</strong> {selectedDemande.batiment} - {selectedDemande.niveau}
                </div>
                <div>
                  <strong>N° Bâtiment :</strong> {selectedDemande.numeroBatiment}
                </div>
                <div>
                  <strong>Carroyage :</strong> {selectedDemande.carroyage}
                </div>
                <div>
                  <strong>Ascenseurs/Escaliers :</strong> {selectedDemande.ascenseurs}
                </div>
                <div>
                  <strong>Date de création :</strong> {selectedDemande.dateCreation}
                </div>
                <div>
                  <strong>Date d'échéance :</strong> {selectedDemande.dateEcheance}
                </div>
                <div>
                  <strong>Zone de sûreté :</strong> 
                  <Chip 
                    label={selectedDemande.zoneSurete || 'Standard'} 
                    size="small"
                    className={`ml-2 ${getPriorityColor(selectedDemande.zoneSurete)}`}
                  />
                </div>
                <div>
                  <strong>Statut :</strong> 
                  <Chip 
                    label={selectedDemande.statut} 
                    size="small"
                    className={`ml-2 ${getStatusColor(selectedDemande.statut)}`}
                  />
                </div>
              </div>
              
              {selectedDemande.dateReelle && (
                <div>
                  <strong>Date de réalisation effective :</strong> {selectedDemande.dateReelle}
                </div>
              )}
              
              <div>
                <strong>Description détaillée :</strong> 
                <p className="mt-1 text-gray-700">{selectedDemande.description}</p>
              </div>
              
              <div>
                <strong>Progression :</strong>
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedDemande.progression}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 mt-1">{selectedDemande.progression}%</span>
                </div>
              </div>
              
              {(selectedDemande.photo1 || selectedDemande.photo2) && (
                <div>
                  <strong>Photos :</strong>
                  <div className="flex space-x-2 mt-2">
                    {selectedDemande.photo1 && (
                      <img 
                        src={selectedDemande.photo1} 
                        alt="Photo 1" 
                        className="w-20 h-20 object-cover rounded border cursor-pointer"
                        onClick={() => window.open(selectedDemande.photo1, '_blank')}
                      />
                    )}
                    {selectedDemande.photo2 && (
                      <img 
                        src={selectedDemande.photo2} 
                        alt="Photo 2" 
                        className="w-20 h-20 object-cover rounded border cursor-pointer"
                        onClick={() => window.open(selectedDemande.photo2, '_blank')}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Fermer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Style CSS pour l'animation du badge */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
};

export default DemandesADP;