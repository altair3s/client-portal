// Fichier: src/components/Reports/PdfFilesList.js
import React, { useState, useEffect } from 'react';
//import { getPdfFiles } from '../../services/google-sheets.service';
import { getPdfRData } from '../../services/google-sheets.service';

const PdfFilesList = ({ category }) => {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPdfFiles = async () => {
      try {
        setLoading(true);
        //const files = await getPdfFiles(category);
        //setPdfFiles(files);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des fichiers PDF');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPdfFiles();
  }, [category]);

  // Filtrer les fichiers PDF par terme de recherche
  const filteredPdfFiles = pdfFiles.filter(file =>
    searchTerm === '' ||
    file.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

   useEffect(() => {
    const fetchPdfFiles = async () => {
      try {
        setLoading(true);
        const allFiles = await getPdfRData();
        // Filtrer par catégorie si nécessaire
        const files = category === 'all' 
          ? allFiles 
          : allFiles.filter(file => file.category.toLowerCase() === category.toLowerCase());
        setPdfFiles(files);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors du chargement des fichiers PDF');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPdfFiles();
  }, [category]);

  // Obtenir le titre en fonction de la catégorie
  const getCategoryTitle = () => {
    switch (category) {
      case 'vacations':
        return 'Fichiers PDF des Vacations';
      case 'remise-en-etat':
        return 'Fichiers PDF des Remises en État';
      case 'mecanisation':
        return 'Fichiers PDF des Mécanisations';
      default:
        return 'Tous les fichiers PDF';
    }
  };

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
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">{getCategoryTitle()}</h2>
      
      <div className="mb-4">
        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Rechercher un fichier..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-3 top-2.5">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      
      {filteredPdfFiles.length > 0 ? (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPdfFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{file.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{new Date(file.date).toLocaleDateString('fr-FR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a 
                      href={file.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                    >
                      <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                      </svg>
                      Télécharger PDF
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
          Aucun fichier PDF trouvé pour cette catégorie.
        </div>
      )}
    </div>
  );
};

export default PdfFilesList;