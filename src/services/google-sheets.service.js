// Fichier: src/services/google-sheets.service.js (avec URLs de PDF)

// Données simulées avec catégories et URLs de PDF
import axios from 'axios';

// Définissez les constantes pour les ID des feuilles et la clé API
const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const REPORTS_SHEET_ID = process.env.REACT_APP_REPORTS_SHEET_ID;

const mockReports = [
  {
    id: '1',
    title: 'Maintenance préventive - Site A',
    date: '2025-05-10',
    status: 'Terminé',
    location: 'Site A - Bâtiment principal',
    interventionType: 'Maintenance préventive',
    technician: 'Thomas Dubois',
    description: 'Vérification complète des installations',
    actions: 'Remplacement des filtres, nettoyage du système',
    recommendations: 'Prévoir une inspection des conduites dans les 6 mois',
    satisfactionRating: '4',
    category: 'vacations',
    pdfUrl: 'https://example.com/reports/vacation_report_1.pdf'
  },
  {
    id: '2',
    title: 'Réparation système ventilation - Site B',
    date: '2025-05-15',
    status: 'En cours',
    location: 'Site B - Étage 3',
    interventionType: 'Réparation',
    technician: 'Marie Laurent',
    description: 'Panne du système de ventilation',
    actions: 'Diagnostic effectué, attente de pièces',
    recommendations: '',
    category: 'remise-en-etat',
    pdfUrl: 'https://example.com/reports/repair_report_1.pdf'
  },
  {
    id: '3',
    title: 'Installation détecteurs - Site C',
    date: '2025-05-20',
    status: 'À venir',
    location: 'Site C - Tous étages',
    interventionType: 'Installation',
    technician: 'Alexandre Martin',
    description: 'Installation de nouveaux détecteurs de fumée',
    actions: '',
    recommendations: '',
    category: 'mecanisation',
    pdfUrl: 'https://example.com/reports/mechanization_report_1.pdf'
  },
  {
    id: '4',
    title: 'Maintenance annuelle - Site D',
    date: '2025-04-28',
    status: 'Terminé',
    location: 'Site D - Hall principal',
    interventionType: 'Maintenance annuelle',
    technician: 'Sophie Renard',
    description: 'Maintenance annuelle des équipements',
    actions: 'Vérification complète, remplacement des pièces usées',
    recommendations: 'Système en bon état, aucune action supplémentaire requise',
    satisfactionRating: '5',
    category: 'vacations',
    pdfUrl: 'https://example.com/reports/vacation_report_2.pdf'
  },
  {
    id: '5',
    title: 'Rénovation système eau - Site F',
    date: '2025-05-05',
    status: 'Terminé',
    location: 'Site F - Tous niveaux',
    interventionType: 'Rénovation',
    technician: 'Philippe Durand',
    description: 'Rénovation complète du système d\'eau',
    actions: 'Remplacement des canalisations, mise à niveau',
    recommendations: 'Suivi régulier recommandé',
    satisfactionRating: '5',
    category: 'remise-en-etat',
    pdfUrl: 'https://example.com/reports/repair_report_2.pdf'
  },
  {
    id: '6',
    title: 'Installation nouvelle machine - Site G',
    date: '2025-05-18',
    status: 'À venir',
    location: 'Site G - Zone de production',
    interventionType: 'Installation',
    technician: 'Alexandre Martin',
    description: 'Installation d\'une nouvelle machine de production',
    actions: '',
    recommendations: '',
    category: 'mecanisation',
    pdfUrl: 'https://example.com/reports/mechanization_report_2.pdf'
  },
  {
    id: '7',
    title: 'Maintenance système air - Site H',
    date: '2025-04-22',
    status: 'Terminé',
    location: 'Site H - Étages 1-3',
    interventionType: 'Maintenance',
    technician: 'Thomas Dubois',
    description: 'Maintenance du système de circulation d\'air',
    actions: 'Nettoyage des conduits, remplacement des filtres',
    recommendations: 'RAS',
    satisfactionRating: '4',
    category: 'vacations',
    pdfUrl: 'https://example.com/reports/vacation_report_3.pdf'
  },
  {
    id: '8',
    title: 'Réparation toiture - Site I',
    date: '2025-05-08',
    status: 'Terminé',
    location: 'Site I - Bâtiment principal',
    interventionType: 'Réparation',
    technician: 'Marie Laurent',
    description: 'Réparation de la toiture suite à des infiltrations',
    actions: 'Remplacement des tuiles endommagées, colmatage des fuites',
    recommendations: 'Inspection semestrielle recommandée',
    satisfactionRating: '4',
    category: 'remise-en-etat',
    pdfUrl: 'https://example.com/reports/repair_report_3.pdf'
  },
  {
    id: '9',
    title: 'Automatisation ligne production - Site J',
    date: '2025-06-01',
    status: 'Planifié',
    location: 'Site J - Zone de production',
    interventionType: 'Installation',
    technician: 'Alexandre Martin',
    description: 'Automatisation complète de la ligne de production',
    actions: '',
    recommendations: '',
    category: 'mecanisation',
    pdfUrl: 'https://example.com/reports/mechanization_report_3.pdf'
  },
  {
    id: '10',
    title: 'Contrôle qualité - Site K',
    date: '2025-05-25',
    status: 'Planifié',
    location: 'Site K - Laboratoire',
    interventionType: 'Contrôle',
    technician: 'Sophie Renard',
    description: 'Contrôle qualité des installations',
    actions: '',
    recommendations: '',
    category: 'vacations',
    pdfUrl: 'https://example.com/reports/vacation_report_4.pdf'
  }
];

const mockDeployments = [
  {
    id: '1',
    title: 'Maintenance préventive',
    date: new Date(2025, 4, 10), // 10 Mai 2025
    status: 'Terminé',
    location: 'Site A - Bâtiment principal',
    description: 'Vérification complète des installations',
    responsible: 'Thomas Dubois',
    completionPercentage: 100,
    completionDate: '2025-05-10',
    dueDate: '2025-05-15'
  },
  {
    id: '2',
    title: 'Réparation système ventilation',
    date: new Date(2025, 4, 15), // 15 Mai 2025
    status: 'En cours',
    location: 'Site B - Étage 3',
    description: 'Panne du système de ventilation',
    responsible: 'Marie Laurent',
    completionPercentage: 60,
    dueDate: '2025-05-20'
  },
  {
    id: '3',
    title: 'Installation détecteurs',
    date: new Date(2025, 4, 20), // 20 Mai 2025
    status: 'Planifié',
    location: 'Site C - Tous étages',
    description: 'Installation de nouveaux détecteurs de fumée',
    responsible: 'Alexandre Martin',
    completionPercentage: 0,
    dueDate: '2025-05-30'
  }
];

const mockSanitaryBlocks = [
  {
    id: '1',
    name: 'Bloc A - RDC',
    location: 'Bâtiment principal - Rez-de-chaussée',
    status: 'Nettoyé',
    lastCleaned: '2025-05-15T09:30:00',
    nextScheduled: '2025-05-16T09:30:00',
    cleaner: 'Sophie Renard',
    notes: 'RAS'
  },
  {
    id: '2',
    name: 'Bloc B - Étage 2',
    location: 'Bâtiment principal - Étage 2',
    status: 'À nettoyer',
    lastCleaned: '2025-05-14T10:15:00',
    nextScheduled: '2025-05-15T10:15:00',
    cleaner: 'Sophie Renard',
    notes: ''
  },
  {
    id: '3',
    name: 'Bloc C - Étage 3',
    location: 'Bâtiment annexe - Étage 3',
    status: 'Problème',
    lastCleaned: '2025-05-10T11:00:00',
    nextScheduled: '2025-05-15T11:00:00',
    cleaner: 'Marc Dupont',
    notes: 'Fuite détectée, intervention nécessaire'
  }
];

console.log('⚠️ Utilisation du service Google Sheets 100% hors ligne avec données intégrées');

// Service pour récupérer les comptes rendus
export const getReports = async () => {
  console.log('[DEV] Récupération simulée des comptes rendus');
  // Simuler un délai
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockReports];
};

// Fonction pour récupérer les données de la feuille PdfR (colonnes D-F)
export const getPdfRData = async () => {
  try {
    const response = await axios.get(
      `https://sheets.googleapis.com/v4/spreadsheets/${REPORTS_SHEET_ID}/values/PdfR!D2:F`,
      {
        params: {
          key: API_KEY
        }
      }
    );
    
    const rows = response.data.values || [];
    
    if (rows.length > 1) { // Ignorer la ligne d'en-tête
      const data = rows.slice(1).map((row, index) => {
        return {
          id: `pdf-${index}`,
          title: row[0] || '', // Colonne D
          category: row[1] || '', // Colonne E
          pdfUrl: row[2] || '' // Colonne F
        };
      });
      
      return data;
    }
    
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération des données PDF:', error);
    throw error;
  }
};

// Service pour récupérer les données du calendrier
export const getCalendarData = async () => {
  console.log('[DEV] Récupération simulée des données du calendrier');
  // Simuler un délai
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockDeployments.map(item => ({
    ...item,
    date: item.date.toISOString().split('T')[0] // Convertir la date en chaîne YYYY-MM-DD
  }));
};

// Service pour récupérer les données des blocs sanitaires
export const getSanitaryBlocksData = async () => {
  console.log('[DEV] Récupération simulée des données des blocs sanitaires');
  // Simuler un délai
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockSanitaryBlocks];
};

export default {
  getReports,
  getCalendarData,
  getSanitaryBlocksData
};