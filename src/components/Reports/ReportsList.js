// Fichier: src/components/Reports/ReportsList.js (avec filtrage par catégorie)
import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DataContext } from '../../contexts/DataContext';

const ReportsList = ({ category = 'all' }) => {
  const params = useParams();
  // Si la catégorie est passée via URL, elle a priorité sur les props
  const currentCategory = params.category || category;
  
  const { reports, loading, error } = useContext(DataContext);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Obtenir le titre de la page en fonction de la catégorie
  const getCategoryTitle = () => {
    switch (currentCategory) {
      case 'vacations':
        return 'Vacations';
      case 'remise-en-etat':
        return 'Remise en état';
      case 'mecanisation':
        return 'Mécanisation';
      default:
        return 'Tous les comptes rendus';
    }
  };

  // Filtrer les rapports par catégorie, statut et terme de recherche
  const filteredReports = reports.filter(report => {
    // Filtrer par catégorie
    const categoryMatch = currentCategory === 'all' || report.category === currentCategory;
    
    // Filtrer par statut
    const statusMatch = filterStatus === 'all' || report.status === filterStatus;
    
    // Filtrer par recherche
    const searchMatch = searchTerm === '' ||
      report.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.technician?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && statusMatch && searchMatch;
  });

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
        <h1 className="text-3xl font-semibold">{getCategoryTitle()}</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <select 
            className="bg-white border border-gray-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="Terminé">Terminés</option>
            <option value="En cours">En cours</option>
            <option value="À venir">À venir</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <li key={report.id}>
                <Link to={`/reports/${report.id}`} className="block hover:bg-gray-50">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-blue-600 truncate">
                          {report.title}
                        </p>
                        <div className={`ml-2 flex-shrink-0 flex ${
                          report.status === 'Terminé' ? 'bg-green-100 text-green-800' : 
                          report.status === 'En cours' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        } text-xs px-2 py-0.5 rounded-full`}>
                          {report.status}
                        </div>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="text-sm text-gray-500">
                          {new Date(report.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {report.location}
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center text-sm text-gray-500">
                          {report.technician}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="px-4 py-5 text-center text-gray-500">
              Aucun compte rendu trouvé avec les filtres sélectionnés.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ReportsList;