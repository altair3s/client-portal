// Fichier: src/components/SanitaryBlocks/CleaningStatusCard.js
import React from 'react';

const CleaningStatusCard = ({ block }) => {
  // Obtenir la classe de couleur en fonction du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'Nettoyé':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'À nettoyer':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Problème':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Formater la date au format français
  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className={`p-4 border-l-4 ${getStatusColor(block.status)}`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{block.name}</h3>
            <p className="text-sm text-gray-600">{block.location}</p>
          </div>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(block.status)}`}>
            {block.status}
          </span>
        </div>
        
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-gray-500">Dernier nettoyage:</span>
            <p className="font-medium">{formatDate(block.lastCleaned)}</p>
          </div>
          <div>
            <span className="text-gray-500">Prochain nettoyage:</span>
            <p className="font-medium">{formatDate(block.nextScheduled)}</p>
          </div>
        </div>
        
        {block.notes && (
          <div className="mt-3">
            <span className="text-gray-500 text-sm">Notes:</span>
            <p className="text-sm mt-1">{block.notes}</p>
          </div>
        )}
        
        {/* Afficher les images s'il y en a */}
        {block.images && (
          <div className="mt-3">
            <div className="flex -space-x-2 overflow-hidden">
              {block.images.split(',').map((image, index) => (
                <img
                  key={index}
                  className="inline-block h-10 w-10 rounded-md border border-white object-cover"
                  src={image.trim()}
                  alt={`${block.name} - image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleaningStatusCard;