// Fichier: src/components/Stats/SanitaryBlocksChart.js
import React, { useContext } from 'react';
import { DataContext } from '../../contexts/DataContext';

const SanitaryBlocksChart = () => {
  const { sanitaryBlocks, loading } = useContext(DataContext);

  if (loading) return <div className="animate-pulse h-32 bg-gray-200 rounded"></div>;
  if (!sanitaryBlocks || sanitaryBlocks.length === 0) return <p className="text-gray-500">Aucune donnée disponible</p>;

  // Calculer les statistiques
  const totalBlocks = sanitaryBlocks.length;
  const cleanedBlocks = sanitaryBlocks.filter(block => block.status === 'Nettoyé').length;
  const pendingBlocks = sanitaryBlocks.filter(block => block.status === 'À nettoyer').length;
  const issueBlocks = sanitaryBlocks.filter(block => block.status === 'Problème').length;

  // Calculer les pourcentages
  const cleanedPercentage = Math.round((cleanedBlocks / totalBlocks) * 100);
  const pendingPercentage = Math.round((pendingBlocks / totalBlocks) * 100);
  const issuePercentage = Math.round((issueBlocks / totalBlocks) * 100);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">État des blocs sanitaires</h3>
      
      <div className="mb-4">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                Nettoyés
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-green-600">
                {cleanedPercentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
            <div style={{ width: `${cleanedPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">
                À nettoyer
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-yellow-600">
                {pendingPercentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-yellow-200">
            <div style={{ width: `${pendingPercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-yellow-500"></div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                Problèmes
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-red-600">
                {issuePercentage}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
            <div style={{ width: `${issuePercentage}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <div>Total: {totalBlocks} blocs</div>
        <div>Taux de conformité: {cleanedPercentage}%</div>
      </div>
    </div>
  );
};

export default SanitaryBlocksChart;